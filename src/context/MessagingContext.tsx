
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Conversation } from '@/types/messaging';
import { User } from '@/types/models';
import { useApp } from './AppContext';

// Local storage key
const MESSAGES_STORAGE_KEY = 'landscaping-messages';
const CONVERSATIONS_STORAGE_KEY = 'landscaping-conversations';

interface MessagingContextType {
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (receiverId: string, content: string) => Message;
  getConversation: (userId: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  markConversationAsRead: (conversationId: string) => void;
  getUnreadCount: () => number;
  deleteMessage: (messageId: string) => void;
  deleteConversation: (conversationId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, settings } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Load messages and conversations from localStorage on initial render
  useEffect(() => {
    if (!currentUser) return;
    
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      const storedConversations = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
      
      if (storedConversations) {
        const parsedConversations = JSON.parse(storedConversations);
        setConversations(parsedConversations);
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, [currentUser]);

  // Save messages and conversations to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);
  
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Send a message to another user
  const sendMessage = (receiverId: string, content: string): Message => {
    if (!currentUser) throw new Error('User not authenticated');
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update or create conversation
    const conversationId = getConversationId(currentUser.id, receiverId);
    const existingConversation = conversations.find(c => c.id === conversationId);
    
    if (existingConversation) {
      setConversations(prev => prev.map(c => 
        c.id === conversationId 
          ? { ...c, lastMessage: newMessage, unreadCount: c.unreadCount + (c.participants.includes(receiverId) ? 1 : 0) }
          : c
      ));
    } else {
      const newConversation: Conversation = {
        id: conversationId,
        participants: [currentUser.id, receiverId],
        lastMessage: newMessage,
        unreadCount: 1,
      };
      setConversations(prev => [...prev, newConversation]);
    }
    
    return newMessage;
  };

  // Get conversation between current user and another user
  const getConversation = (userId: string): Conversation | undefined => {
    if (!currentUser) return undefined;
    
    const conversationId = getConversationId(currentUser.id, userId);
    return conversations.find(c => c.id === conversationId);
  };

  // Get all messages for a conversation
  const getMessages = (conversationId: string): Message[] => {
    if (!currentUser) return [];
    
    const [user1, user2] = conversationId.split('-');
    
    return messages.filter(m => 
      (m.senderId === user1 && m.receiverId === user2) || 
      (m.senderId === user2 && m.receiverId === user1)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  // Mark all messages in a conversation as read
  const markConversationAsRead = (conversationId: string) => {
    if (!currentUser) return;
    
    const [user1, user2] = conversationId.split('-');
    const otherUserId = user1 === currentUser.id ? user2 : user1;
    
    setMessages(prev => prev.map(m => 
      m.senderId === otherUserId && m.receiverId === currentUser.id && !m.read
        ? { ...m, read: true }
        : m
    ));
    
    setConversations(prev => prev.map(c => 
      c.id === conversationId 
        ? { ...c, unreadCount: 0 }
        : c
    ));
  };

  // Get total unread message count for current user
  const getUnreadCount = (): number => {
    if (!currentUser) return 0;
    
    return conversations.reduce((count, conv) => {
      if (conv.participants.includes(currentUser.id)) {
        return count + conv.unreadCount;
      }
      return count;
    }, 0);
  };

  // Delete a message
  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    
    // Update conversations if needed
    setConversations(prev => prev.map(conv => {
      if (conv.lastMessage && conv.lastMessage.id === messageId) {
        const conversationMessages = getMessages(conv.id);
        const newLastMessage = conversationMessages.length > 1 
          ? conversationMessages[conversationMessages.length - 2] 
          : undefined;
        
        return {
          ...conv,
          lastMessage: newLastMessage,
          unreadCount: conversationMessages.filter(m => !m.read && m.receiverId === currentUser?.id).length
        };
      }
      return conv;
    }));
  };

  // Delete an entire conversation
  const deleteConversation = (conversationId: string) => {
    const [user1, user2] = conversationId.split('-');
    
    setMessages(prev => prev.filter(m => 
      !((m.senderId === user1 && m.receiverId === user2) || 
        (m.senderId === user2 && m.receiverId === user1))
    ));
    
    setConversations(prev => prev.filter(c => c.id !== conversationId));
  };

  // Helper function to generate a consistent conversation ID
  const getConversationId = (userId1: string, userId2: string): string => {
    return [userId1, userId2].sort().join('-');
  };

  return (
    <MessagingContext.Provider
      value={{
        messages,
        conversations,
        sendMessage,
        getConversation,
        getMessages,
        markConversationAsRead,
        getUnreadCount,
        deleteMessage,
        deleteConversation,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
