
import { Conversation, MessageSender } from "@/lib/types";

export default function ConversationPane( {conversation} : {conversation: Conversation | null}) {
  return (
    conversation ? (
      <div className="flex flex-col flex-grow w-full h-full">
        <div className="flex flex-row h-[106px] border-b p-5 space-x-10 align-bottom">
          <div className="flex flex-col justify-end">
            <p>Recipient</p>
            <p className="font-bold">{conversation.guardian_name}</p>
          </div>
          <div className="flex flex-col justify-end">
            <p>Student</p>
            <p className="font-bold">{conversation.student_name}</p>
          </div>
        </div>
        <div className="p-5 flex-grow">
          {conversation.chat_history.map((message) => (
            <div className={`mb-10 flex flex-col w-full ${message.sender === MessageSender.Agent ? "items-end" : ""}`}>
              <div className="bg-gray-200 p-2 rounded-md w-fit">
                <p className="text-md">{message.content}</p>
              </div> 
              <p className="text-xs">{message.sender}</p>
            </div>
          ))}
        </div>
        {/* message box */}
        <div className="border p-5">
          <form>
            <div className="border border-gray-300 rounded-md flex-row flex py-2 px-3">
              <input className="w-full" placeholder="Send a message">
              </input>
              <button className="px-3 py-2 bg-black text-white rounded-md" type="submit">
                <p>send</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : (
      <div>
        No conversation selected
      </div>
    )
  )
}