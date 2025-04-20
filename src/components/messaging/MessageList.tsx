
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useMessaging } from '@/context/MessagingContext';
import { User } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

interface MessageListProps {
  onSelectUser: (user: User) => void;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectUser }) => {
  const { settings, auth } = useApp();
  const currentUser = auth.currentUser;
  const { conversations, getMessages } = useMessaging();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  
  useEffect(() => {
    if (!settings.users || !currentUser) return;
    
    // Filter out current user and filter by search term
    const filteredUsers = settings.users
      .filter(user => user.id !== currentUser.id)
      .filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
          user.username.toLowerCase().includes(searchLower) ||
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower))
        );
      });
    
    setDisplayedUsers(filteredUsers);
  }, [settings.users, searchTerm, currentUser]);
  
  // Get the last message preview for a user
  const getLastMessagePreview = (userId: string): { text: string, date: Date } | null => {
    if (!currentUser) return null;
    
    const conversationId = [currentUser.id, userId].sort().join('-');
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation?.lastMessage) {
      return {
        text: conversation.lastMessage.content.substring(0, 30) + (conversation.lastMessage.content.length > 30 ? '...' : ''),
        date: conversation.lastMessage.timestamp
      };
    }
    
    return null;
  };
  
  // Get unread count for a specific user
  const getUnreadCountForUser = (userId: string): number => {
    if (!currentUser) return 0;
    
    const conversationId = [currentUser.id, userId].sort().join('-');
    const conversation = conversations.find(c => c.id === conversationId);
    
    return conversation?.unreadCount || 0;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Conversations
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayedUsers.length > 0 ? (
            displayedUsers.map(user => {
              const lastMessage = getLastMessagePreview(user.id);
              const unreadCount = getUnreadCountForUser(user.id);
              
              return (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto relative"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0">
                      <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium">{user.name || user.username}</div>
                      {lastMessage ? (
                        <>
                          <div className="text-sm text-muted-foreground truncate">
                            {lastMessage.text}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(lastMessage.date, 'dd MMM HH:mm', { locale: fr })}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Aucun message
                        </div>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground rounded-full h-5 min-w-5 px-1 flex items-center justify-center text-xs">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageList;
