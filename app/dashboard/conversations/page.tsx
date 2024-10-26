"use client"

import { useState } from 'react';
import { Conversation } from '@/lib/types';
import dummyConversations from '@/lib/dummy_data';
import ConversationPane from '@/app/dashboard/_components/conversation-pane';
import ConversationPreviewsColumn from '@/app/dashboard/_components/conversation-previews-column';

export default function Page() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(dummyConversations[0]);

  return (
    <div className="flex flex-row h-full">
        <ConversationPreviewsColumn conversations={dummyConversations} />
        <ConversationPane conversation={selectedConversation ? selectedConversation : null} />
    </div>
  )
}