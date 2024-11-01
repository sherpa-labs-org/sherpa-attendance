
import { Conversation } from "@/lib/types";
import { useState } from "react";

import Image from "next/image";

export default function ConversationPreview( { conversation, selected }: { conversation: Conversation, selected: boolean }) {


  return (
    <div className={`flex flex-row items-center p-4 border-b border-b-foreground/10 justify-between ${selected ? 'bg-gray-200' : ''}`}>
      <div className="flex flex-row">
        <Image src="/avatar.png" width={50} height={50} className="rounded-full self-start mr-4" alt={""} />
        <div className="flex flex-col">
          <div className="font-medium text-md">{conversation.guardian_name}</div>
          <div className="text-sm">{conversation.chat_history[conversation.chat_history.length - 1].content}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="text-sm text-foreground/50">{conversation.chat_history[conversation.chat_history.length - 1].sent_date.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="text-sm text-foreground/50">{conversation.status}</div>
      </div>
    </div>
  );
}