import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useMessaging } from '@/context/MessagingContext';
import { User } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Trash2, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Message } from '@/types/messaging';

interface ChatWindowProps {
  selectedUser: User | null;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, onBack }) => {
  const { auth } = useApp();
  const currentUser = auth.currentUser;
  const { sendMessage, getConversation, getMessages, markConversationAsRead, deleteMessage } = useMessaging();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    
    const conversationId = [currentUser.id, selectedUser.id].sort().join('-');
    const conversationMessages = getMessages(conversationId);
    setMessages(conversationMessages);
    
    // Mark messages as read
    markConversationAsRead(conversationId);
    
    // Scroll to bottom
    scrollToBottom();
  }, [selectedUser, currentUser]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return;
    
    const sentMessage = sendMessage(selectedUser.id, newMessage.trim());
    setMessages(prev => [...prev, sentMessage]);
    setNewMessage('');
    
    // Scroll to bottom after sending
    setTimeout(scrollToBottom, 100);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
      deleteMessage(messageId);
      
      // Update local messages state
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };
  
  if (!selectedUser || !currentUser) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground pt-6">
          Sélectionnez un utilisateur pour démarrer une conversation
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="bg-primary/10 p-2 rounded-full mr-2">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{selectedUser.name || selectedUser.username}</CardTitle>
            {selectedUser.position && (
              <CardDescription>{selectedUser.position}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map(message => {
            const isSender = message.senderId === currentUser.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    isSender
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted rounded-tl-none'
                  }`}
                >
                  <div className="break-words">{message.content}</div>
                  <div
                    className={`text-xs mt-1 flex items-center justify-between ${
                      isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{format(message.timestamp, 'HH:mm', { locale: fr })}</span>
                    
                    {isSender && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Aucun message. Commencez la conversation !
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="pt-2 flex-shrink-0">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
