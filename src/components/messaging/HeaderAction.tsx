
import React from 'react';
import { useApp } from '@/context/AppContext';
import MessageIndicator from './MessageIndicator';

export const HeaderAction = () => {
  const { auth } = useApp();
  
  if (!auth.isAuthenticated) {
    return null;
  }
  
  return (
    <MessageIndicator />
  );
};

export default HeaderAction;
