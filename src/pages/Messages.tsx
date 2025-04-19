
import React, { useState } from 'react';
import { User } from '@/types/models';
import MessageList from '@/components/messaging/MessageList';
import ChatWindow from '@/components/messaging/ChatWindow';

const Messages: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  return (
    <div className="container mx-auto p-4 h-[calc(100vh-7rem)] animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Messagerie</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100%-3rem)]">
        <div className={`${selectedUser ? 'hidden md:block' : ''} md:col-span-1 h-full`}>
          <MessageList onSelectUser={setSelectedUser} />
        </div>
        
        <div className={`${!selectedUser ? 'hidden md:block' : ''} md:col-span-2 h-full`}>
          <ChatWindow 
            selectedUser={selectedUser} 
            onBack={() => setSelectedUser(null)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;
