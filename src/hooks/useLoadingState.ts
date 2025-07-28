import { useState, useCallback } from 'react';

interface LoadingStates {
  [key: string]: boolean;
}

export const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  // Helper pour gérer une action async avec loading
  const withLoading = useCallback(async <T>(
    key: string, 
    action: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true);
    try {
      return await action();
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    loadingStates
  };
};

// Hook spécialisé pour les formulaires
export const useFormLoading = () => {
  const { setLoading, isLoading, withLoading } = useLoadingState();

  const submitWithLoading = useCallback(async <T>(
    action: () => Promise<T>
  ): Promise<T> => {
    return withLoading('submit', action);
  }, [withLoading]);

  const isSubmitting = useCallback(() => isLoading('submit'), [isLoading]);

  return {
    submitWithLoading,
    isSubmitting,
    setLoading,
    isLoading,
    withLoading
  };
};