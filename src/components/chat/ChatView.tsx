import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { useWorkspace } from '../../context/WorkspaceContext';

interface ChatViewProps {
  onOpenTaskDetails: (taskId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onOpenTaskDetails }) => {
  const { selectedConversationId, setSelectedConversationId } = useWorkspace();
  const [showMobileList, setShowMobileList] = useState(!selectedConversationId);

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white" id="main-chat-view-container">
      {/* Desktop Left Sidebar / Mobile List */}
      <div className={`w-full md:w-80 lg:w-96 h-full shrink-0 ${
        selectedConversationId ? 'hidden md:block' : 'block'
      }`}>
        <ConversationList />
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 h-full ${
        !selectedConversationId ? 'hidden md:flex' : 'flex'
      }`}>
        <ChatWindow 
          onOpenTaskDetails={onOpenTaskDetails}
          onBackMobile={() => setSelectedConversationId(null)}
        />
      </div>
    </div>
  );
};
