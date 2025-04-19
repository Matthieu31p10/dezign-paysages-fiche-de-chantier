
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MessageIndicator from './MessageIndicator';

export const HeaderAction = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <MessageIndicator />
  );
};

export default HeaderAction;
