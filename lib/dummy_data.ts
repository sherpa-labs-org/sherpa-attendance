import { Conversation, Message, MessageSender } from "@/lib/types";
import { UUID } from "crypto";

export const dummyConversationHistory1: Message[] = [
  {
    id: crypto.randomUUID(),
    content: "Hello why did your kid miss school today?",
    sent_date: new Date(),
    sender: MessageSender.Agent,
  },
  {
    id: crypto.randomUUID(),
    content: "He was feeling sick",
    sent_date: new Date(),
    sender: MessageSender.Guardian,
  },
];

export const dummyConversationHistory2: Message[] = [
  {
    id: crypto.randomUUID(),
    content: "Hello why did your kid miss school today?",
    sent_date: new Date(),
    sender: MessageSender.Agent,
  },
  {
    id: crypto.randomUUID(),
    content: "He missed the bus",
    sent_date: new Date(),
    sender: MessageSender.Guardian,
  },
];

export const dummyConversationHistory3: Message[] = [
  {
    id: crypto.randomUUID(),
    content: "Why was your child late to school?",
    sent_date: new Date(),
    sender: MessageSender.Agent,
  },
  {
    id: crypto.randomUUID(),
    content: "Traffic was terrible this morning.",
    sent_date: new Date(),
    sender: MessageSender.Guardian,
  },
];

export const dummyConversationHistory4: Message[] = [
  {
    id: crypto.randomUUID(),
    content: "Did your child complete their homework?",
    sent_date: new Date(),
    sender: MessageSender.Agent,
  },
  {
    id: crypto.randomUUID(),
    content: "Yes, they finished it last night.",
    sent_date: new Date(),
    sender: MessageSender.Guardian,
  },
];

export const dummyConversationHistory5: Message[] = [
  {
    id: crypto.randomUUID(),
    content: "How is your child doing in class?",
    sent_date: new Date(),
    sender: MessageSender.Agent,
  },
  {
    id: crypto.randomUUID(),
    content: "They're doing great, thank you!",
    sent_date: new Date(),
    sender: MessageSender.Guardian,
  },
];

export const dummyConversation1: Conversation = {
  id: crypto.randomUUID(),
  student_name: "Jonny Appleseed",
  guardian_name: "Mrs. Appleseed",
  status: "Active",
  chat_history: dummyConversationHistory1,
};

export const dummyConversation2: Conversation = {
  id: crypto.randomUUID(),
  student_name: "Jane Doe",
  guardian_name: "Mr. Doe",
  status: "Active",
  chat_history: dummyConversationHistory2,
};

export const dummyConversation3: Conversation = {
  id: crypto.randomUUID(),
  student_name: "Alice Wonderland",
  guardian_name: "Mr. Wonderland",
  status: "Active",
  chat_history: dummyConversationHistory3,
};

export const dummyConversation4: Conversation = {
  id: crypto.randomUUID(),
  student_name: "Bob Builder",
  guardian_name: "Mrs. Builder",
  status: "Active",
  chat_history: dummyConversationHistory4,
};

export const dummyConversation5: Conversation = {
  id: crypto.randomUUID(),
  student_name: "Charlie Brown",
  guardian_name: "Ms. Brown",
  status: "Active",
  chat_history: dummyConversationHistory5,
};

const dummyConversations: Conversation[] = [dummyConversation1, dummyConversation2, dummyConversation3, dummyConversation4, dummyConversation5];
export default dummyConversations;
