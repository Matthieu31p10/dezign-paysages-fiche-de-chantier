import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LoginRecord {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  login_time: string;
  user_agent: string;
  ip_address?: string;
}

export const useLoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLoginHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('login_history')
        .select('*')
        .order('login_time', { ascending: false });

      if (fetchError) throw fetchError;
      
      setLoginHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      console.error('Error loading login history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const recordLogin = async (userEmail: string, userName: string, userId: string) => {
    try {
      const loginRecord = {
        user_id: userId,
        user_email: userEmail,
        user_name: userName,
        login_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: null // Could be populated server-side
      };

      const { error } = await supabase
        .from('login_history')
        .insert([loginRecord]);

      if (error) throw error;
      
      // Refresh history after recording
      await loadLoginHistory();
    } catch (err) {
      console.error('Error recording login:', err);
    }
  };

  const clearHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('login_history')
        .delete()
        .neq('id', ''); // Delete all records

      if (error) throw error;
      
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