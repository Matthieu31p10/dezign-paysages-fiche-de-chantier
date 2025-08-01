import { useState, useEffect } from 'react';

export interface LoginRecord {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  login_time: string;
  user_agent: string;
  ip_address?: string;
}

const STORAGE_KEY = 'login_history';

export const useLoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLoginHistory = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const history = stored ? JSON.parse(stored) : [];
      setLoginHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Error loading login history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const recordLogin = async (userEmail: string, userName: string, userId: string) => {
    try {
      const loginRecord: LoginRecord = {
        id: `login_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        user_email: userEmail,
        user_name: userName,
        login_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: undefined
      };

      const stored = localStorage.getItem(STORAGE_KEY);
      const history = stored ? JSON.parse(stored) : [];
      const updatedHistory = [loginRecord, ...history];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setLoginHistory(updatedHistory);
    } catch (err) {
      console.error('Error recording login:', err);
    }
  };

  const clearHistory = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLoginHistory([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      console.error('Error clearing login history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLoginHistory();
  }, []);

  return {
    loginHistory,
    isLoading,
    error,
    recordLogin,
    clearHistory,
    refetch: loadLoginHistory
  };
};