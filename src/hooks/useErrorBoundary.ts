import { useCallback, useState } from 'react';
import { ErrorLogger } from '@/utils/errorHandler';

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const captureError = useCallback((error: Error, context?: Record<string, unknown>) => {
    ErrorLogger.log(error, 'high', context);
    setError(error);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Fonction pour déclencher manuellement une error boundary
  const throwError = useCallback((error: Error) => {
    throw error;
  }, []);

  return {
    error,
    captureError,
    resetError,
    throwError,
    hasError: error !== null,
  };
};

// Hook pour gérer les erreurs async de manière propre
export const useAsyncError = () => {
  const { captureError } = useErrorBoundary();

  const withAsyncErrorHandler = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: Record<string, unknown>
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        captureError(error as Error, context);
        return null;
      }
    },
    [captureError]
  );

  return { withAsyncErrorHandler };
};

export default useErrorBoundary;