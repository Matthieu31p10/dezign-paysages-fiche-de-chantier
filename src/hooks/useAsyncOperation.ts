import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseAsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAsyncOperation = (options: UseAsyncOperationOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }
      
      options.onSuccess?.();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      const errorMessage = options.errorMessage || error.message;
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      options.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset
  };
};