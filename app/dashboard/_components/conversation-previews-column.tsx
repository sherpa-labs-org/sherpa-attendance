"use client"

import { Conversation } from "@/lib/types";
import ConversationPreview from "@/app/dashboard/_components/conversation-preview";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const statusMapping = {
  action_needed: "Action Needed",
  completed: "Completed",
};

type StatusKey = keyof typeof statusMapping;
type FilterOption = StatusKey | 'all';
const filterOptions: FilterOption[] = ['all', ...Object.keys(statusMapping) as StatusKey[]];

export default function ConversationPreviewsColumn({ conversations, onSelectConversation }: { conversations: Conversation[], onSelectConversation: (conversation: Conversation) => void }) {

  const [statusFilter, setStatusFilter] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // const getStatusCounts = () => {
  //   const counts = {
  //     awaiting_message_approval: 0,
  //     action_needed: 0,
  //     in_progress: 0,
  //     completed: 0
  //   };
  //   return counts;
  // };

  // const statusCounts = getStatusCounts();

  const handleFilterClick = (filter: FilterOption) => {
    setStatusFilter(filter);
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    onSelectConversation(conversation);
  };

  return (
    <div className="flex flex-col min-w-96 border-r border-b-foreground/10 h-full">
      <div className="flex items-center justify-between p-4 border-b-foreground/10">
        <h2 className="font-bold text-lg">Conversations</h2>
        <button className="text-primary">New conversation</button>
      </div>
      
      {/* Filters */}
      <div className='flex flex-row w-full border-b border-border mb-2'>
          {filterOptions.map((filter) => (
            <Button
              key={filter}
              variant='ghost'
              className={`rounded-none font-normal px-4 py-2 ${statusFilter === filter ? 'border-b-2 border-black' : 'border-b-2 border-transparent'}`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter === 'all' ? 'All' : statusMapping[filter]}
              {/* {(filter === 'awaiting_message_approval' || filter === 'action_needed') && statusCounts[filter] > 0 && (
                <span className="ml-2 w-[22px] h-[22px] items-center bg-[#F5EE9E] rounded-md px-2 py-1 text-xs">
                  {statusCounts[filter]}
                </span>
              )} */}
            </Button>
          ))}
        </div>
        {/* Search Bar */}
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-md"
          />
        </div>
      <div className="flex flex-col">
        {conversations
          .filter(conversation => 
            conversation.guardian_name.toLowerCase().includes(searchQuery.toLowerCase()) // Assuming conversations have a 'title' property
          )
          .map((conversation) => (
            <div key={conversation.id} onClick={() => handleConversationClick(conversation)}>
              <ConversationPreview conversation={conversation} selected={selectedConversation === conversation} />
            </div>
          ))}
      </div>
    </div>
  );
}