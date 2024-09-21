import json
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
import httpx
from pydantic import BaseModel
from typing import List, Optional, Literal
from supabase import create_client, Client
from datetime import date
import os
from dotenv import load_dotenv
import openai

# Initialize FastAPI app
app = FastAPI()

load_dotenv()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# Get sendblue constants
SENDBLUE_BASE_URL = os.environ.get("SENDBLUE_BASE_URL")
SENDBLUE_API_KEY = os.environ.get("SENDBLUE_API_KEY")
SENDBLUE_API_SECRET = os.environ.get("SENDBLUE_API_SECRET")

# Global variables
BACKEND_BASE_URL = os.environ.get("BACKEND_BASE_URL")
INITIAL_MESSAGE_TEMPLATE = "Hello, our records show that {student_name} was absent today. Can you please provide a reason for their absence?"
AUTO_APPROVE = False

# OpenAI configuration
openai.api_key = os.environ.get("OPENAI_API_KEY")

# Pydantic models


class Absence(BaseModel):
    id: str
    student_id: str
    student_name: str
    date: date
    rfa: str
    guardian_name: str
    guardian_phone: str


class AttendanceReport(BaseModel):
    date: date
    school_id: str
    absences: List[Absence]


class Message(BaseModel):
    conversation_id: str
    content: str
    sender_type: Literal["guardian", "admin"]
    status: str
    was_downgraded: Optional[bool] = None
    sendblue_message_handle: Optional[str] = None


class AIResponse(BaseModel):
    rfa: Optional[str]
    next_action: str
    response_text: str

# Helper Functions


def get_attendance_report() -> AttendanceReport:
    # Hardcoded attendance report for now
    return AttendanceReport(
        date=date.today(),
        school_id="62566731-2ddc-475c-9778-a6106928d2a0",
        absences=[
            Absence(id="2", student_id="S002", student_name="Jane Smith", date=date.today(),
                    rfa="Excused - Doctor's appointment", guardian_name="Sally Smith", guardian_phone="+16509245188"),
            Absence(id="3", student_id="S003", student_name="Bob Johnson", date=date.today(),
                    rfa="Unexplained", guardian_name="Jessy Johnson", guardian_phone="+16509245188"),
        ]
    )


async def sendblue_send_message(phone_number: str, content: str) -> dict:
    url = f"{SENDBLUE_BASE_URL}/send-message"
    payload = json.dumps({
        "number": phone_number,
        "content": content,
        # our ngrok reverse proxy to http://127.0.0.1:8000
        "status_callback": f"https://b5cb-173-13-131-249.ngrok-free.app/sendblue_callback"
    })

    headers = {
        "sb-api-key-id": SENDBLUE_API_KEY,
        "sb-api-secret-key": SENDBLUE_API_SECRET,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, content=payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            error_detail = f"HTTP Status Error: {
                e.response.status_code} - {e.response.text}"
            print(f"Error sending message: {error_detail}")
            raise HTTPException(status_code=e.response.status_code,
                                detail=f"Error sending message: {error_detail}")
        except httpx.RequestError as e:
            error_detail = f"Request Error: {str(e)}"
            print(f"Error sending message: {error_detail}")
            raise HTTPException(
                status_code=500, detail=f"Error sending message: {error_detail}")
        except Exception as e:
            error_detail = f"Unexpected error: {str(e)}"
            print(f"Error sending message: {error_detail}")
            raise HTTPException(
                status_code=500, detail=f"Error sending message: {error_detail}")


def get_or_create_guardian(phone_number: str, school_id: str, first_name: str, last_name: str) -> str:
    # Try to find an existing guardian
    existing_guardian = supabase.table("guardians").select(
        "*").eq("phone_number", phone_number).eq("school_id", school_id).execute()

    if existing_guardian.data:
        return existing_guardian.data[0]['id']

    # If not found, create a new guardian
    new_guardian = supabase.table("guardians").insert({
        "phone_number": phone_number,
        "school_id": school_id,
        "first_name": first_name,
        "last_name": last_name
    }).execute()

    return new_guardian.data[0]['id']


def create_conversation(student_id: str, absence_id: str, school_id: str, guardian_id: str) -> str:
    conversation_data = {
        "topic": "Absence Inquiry",
        "student_id": student_id,
        "school_id": school_id,
        "status": "in_progress",
        "absence_id": absence_id,
        "guardian_id": guardian_id,
        "user_id": None  # Leave this null for the MVP
    }
    result = supabase.table("conversations").insert(
        conversation_data).execute()
    return result.data[0]['id']


def create_message(message: Message) -> str:
    message_data = {
        "conversation_id": message.conversation_id,
        "content": message.content,
        "sender_type": message.sender_type,
        "status": message.status,
        "was_downgraded": message.was_downgraded,
        "sendblue_message_handle": message.sendblue_message_handle
    }
    result = supabase.table("messages").insert(message_data).execute()
    return result.data[0]['id']


async def initiate_conversation(absence: Absence, school_id: str, auto_approve: bool) -> dict:
    initial_message = INITIAL_MESSAGE_TEMPLATE.format(
        student_name=absence.student_name)
    sendblue_response = None

    if auto_approve:
        try:
            sendblue_response = await sendblue_send_message(absence.guardian_phone, initial_message)
        except HTTPException as e:
            print(f"Failed to send message via Sendblue: {str(e)}")
            raise e

    # Get or create guardian
    guardian_first_name, guardian_last_name = absence.guardian_name.split(
        " ", 1)
    guardian_id = get_or_create_guardian(
        absence.guardian_phone, school_id, guardian_first_name, guardian_last_name)

    # Create conversation
    conversation_id = create_conversation(
        absence.student_id, absence.id, school_id, guardian_id)

    # Create message
    message = Message(
        conversation_id=conversation_id,
        content=initial_message,
        sender_type="admin",  # Added missing comma
        status="AWAITING_APPROVAL" if not auto_approve else sendblue_response.get(
            "status", "QUEUED"),
        was_downgraded=sendblue_response.get(
            "was_downgraded") if auto_approve else None,
        sendblue_message_handle=sendblue_response.get(
            "message_handle") if auto_approve else None
    )
    message_id = create_message(message)

    return {
        "conversation_id": conversation_id,
        "message_id": message_id,
        "status": message.status
    }


async def ai_process_conversation(conversation_history: List[dict], participant_roles: List[dict]) -> AIResponse:
    prompt = f"""
    Given the following conversation history and participant roles, please analyze the conversation and provide:
    1. A reason for absence (RFA) if one has been made clear. If not clear, respond with null.
    2. A next action to be taken in this conversation (either 'Action Needed' or 'In Progress' category).
    3. A text response to send to the recipient based on the above choices.

    Conversation History:
    {json.dumps(conversation_history)}

    Participant Roles:
    {json.dumps(participant_roles)}

    Please respond in JSON format with the following structure:
    {{
        "rfa": "excused - sick" or null,
        "next_action": "Action Needed - add specialist to chat",
        "response_text": "I'm sorry to hear that. Could you provide more details about the illness?"
    }}
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an AI assistant helping to process school absence conversations."},
            {"role": "user", "content": prompt}
        ]
    )

    ai_response = json.loads(response.choices[0].message.content)
    return AIResponse(**ai_response)

# Endpoints


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/initiate_conversations")
async def initiate_conversations(background_tasks: BackgroundTasks):
    """
    Download the attendance report and initiate conversations for unexplained absences
    """
    attendance_report = get_attendance_report()
    initiated_conversations = []

    for absence in attendance_report.absences:
        if absence.rfa == "Unexplained":
            background_tasks.add_task(
                initiate_conversation,
                absence,
                attendance_report.school_id,
                AUTO_APPROVE
            )
            initiated_conversations.append({
                "student_id": absence.student_id,
                "absence_id": absence.id,
                "guardian_phone": absence.guardian_phone
            })

    return {"status": "Conversation initiation tasks added for unexplained absences", "initiated_conversations": initiated_conversations}


@app.post("/approve_and_send_message/{message_id}")
async def approve_and_send_message(message_id: str):
    # Fetch the message
    message_result = supabase.table("messages").select(
        "*").eq("id", message_id).single().execute()
    if not message_result.data:
        raise HTTPException(status_code=404, detail="Message not found")

    message = Message(**message_result.data)

    if message.status != "AWAITING_APPROVAL":
        raise HTTPException(
            status_code=400, detail="Message is not in AWAITING_APPROVAL status")

    # Fetch the conversation
    conversation_result = supabase.table("conversations").select(
        "*").eq("id", message.conversation_id).single().execute()
    if not conversation_result.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    guardian_id = conversation_result.data.get("guardian_id")
    if not guardian_id:
        raise HTTPException(
            status_code=404, detail="Guardian not associated with conversation")

    # Fetch the guardian
    guardian_result = supabase.table("guardians").select(
        "phone_number").eq("id", guardian_id).single().execute()
    if not guardian_result.data:
        raise HTTPException(status_code=404, detail="Guardian not found")

    guardian_phone = guardian_result.data["phone_number"]
    if not guardian_phone:
        raise HTTPException(
            status_code=404, detail="Guardian phone number not found")

    # Send the message
    try:
        sendblue_response = await sendblue_send_message(guardian_phone, message.content)
    except HTTPException as e:
        # Log the error and re-raise
        print(f"Failed to send message via Sendblue: {str(e)}")
        raise

    # Update the message status
    updated_message = supabase.table("messages").update({
        "status": sendblue_response.get("status", "SENT"),
        "was_downgraded": sendblue_response.get("was_downgraded"),
        "sendblue_message_handle": sendblue_response.get("message_handle")
    }).eq("id", message_id).execute()

    return {"status": "Message approved and sent", "sendblue_response": sendblue_response}


@app.post("/sendblue_callback")
async def sendblue_callback(callback_data: dict):
    message_handle = callback_data.get("message_handle")
    new_status = callback_data.get("status")

    if not message_handle or not new_status:
        raise HTTPException(status_code=400, detail="Invalid callback data")

    updated_message = supabase.table("messages").update({
        "status": new_status,
        "was_downgraded": callback_data.get("was_downgraded")
    }).eq("sendblue_message_handle", message_handle).execute()

    if not updated_message.data:
        raise HTTPException(status_code=404, detail="Message not found")

    return {"status": "Message status updated"}


@app.post("/process_response")
async def process_response(conversation_id: str, message_content: str):
    new_message = Message(
        conversation_id=conversation_id,
        content=message_content,
        sender_type="guardian",
        status="DELIVERED"
    )
    create_message(new_message)

    conversation = supabase.table("conversations").select(
        "*").eq("id", conversation_id).single().execute()
    if not conversation.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if not conversation.data.get("rfa"):
        messages = supabase.table("messages").select(
            "*").eq("conversation_id", conversation_id).order("created_at").execute()
        participants = supabase.table("conversation_participants").select(
            "*").eq("conversation_id", conversation_id).execute()

        ai_response = await ai_process_conversation(messages.data, participants.data)

        update_data = {"status": "in_progress"}
        if ai_response.rfa:
            update_data["rfa"] = ai_response.rfa
        if ai_response.next_action.startswith("Action Needed"):
            update_data["status"] = ai_response.next_action

        supabase.table("conversations").update(
            update_data).eq("id", conversation_id).execute()

        admin_participant = next(
            p for p in participants.data if p["type"] == "admin")
        ai_message = Message(
            conversation_id=conversation_id,
            content=ai_response.response_text,
            sender_type="admin",
            status="AWAITING_APPROVAL" if not AUTO_APPROVE else "QUEUED"
        )
        ai_message_id = create_message(ai_message)

        if AUTO_APPROVE:
            guardian = next(
                p for p in participants.data if p["type"] == "guardian")
            guardian_data = supabase.table("guardians").select("phone_number").eq(
                "id", guardian["guardian_id"]).single().execute()
            if not guardian_data.data:
                raise HTTPException(
                    status_code=404, detail="Guardian phone number not found")

            await sendblue_send_message(guardian_data.data["phone_number"], ai_response.response_text)

            supabase.table("messages").update(
                {"status": "SENT"}).eq("id", ai_message_id).execute()

    else:
        # If RFA exists, notify human to respond (placeholder for now)
        print("TODO: Notify human to respond to the conversation")

    return {"status": "Message processed successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
