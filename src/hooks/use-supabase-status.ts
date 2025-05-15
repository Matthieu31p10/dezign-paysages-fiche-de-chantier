
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseStatus {
  isConnected: boolean;
  lastChecked: Date | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSupabaseStatus(checkIntervalMs = 60000) {
  const [status, setStatus] = useState<SupabaseStatus>({
    isConnected: false,
    lastChecked: null,
    isLoading: true,
    error: null
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.from('settings').select('id').limit(1);
      
      if (error) {
        setStatus({
          isConnected: false,
          lastChecked: new Date(),
          isLoading: false,
          error: new Error(error.message)
        });
      } else {
        setStatus({
          isConnected: true,
          lastChecked: new Date(),
          isLoading: false,
          error: null
        });
      }
    } catch (err) {
      setStatus({
        isConnected: false,
        lastChecked: new Date(),
        isLoading: false,
        error: err instanceof Error ? err : new Error('Erreur inconnue')
      });
    }
  };

  // Vérifier la connexion au chargement du composant
  useEffect(() => {
    checkConnection();
    
    // Configurer une vérification périodique si demandée
    let intervalId: number | undefined;
    if (checkIntervalMs > 0) {
      intervalId = window.setInterval(checkConnection, checkIntervalMs);
    }
    
    // Nettoyer l'intervalle
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkIntervalMs]);

  return {
    ...status,
    checkConnection
  };
}
