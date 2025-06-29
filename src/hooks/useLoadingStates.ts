
import { useState, useCallback } from 'react';

interface LoadingStates {
  [key: string]: boolean;
}

export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    key: string, 
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    setLoading(key, true);
    try {
      return await asyncOperation();
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return { setLoading, isLoading, withLoading };
};
