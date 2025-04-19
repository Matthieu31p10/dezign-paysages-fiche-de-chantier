
import React from 'react';
import { useMessaging } from '@/context/MessagingContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MessageIndicator: React.FC = () => {
  const { getUnreadCount } = useMessaging();
  const navigate = useNavigate();
  const unreadCount = getUnreadCount();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate('/messages')}
      title="Messages"
    >
      <MessageCircle className="h-5 w-5" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full min-w-5 h-5 flex items-center justify-center text-xs">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Button>
  );
};

export default MessageIndicator;
