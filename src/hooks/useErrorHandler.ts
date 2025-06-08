
import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { showToast = true, logToConsole = true } = options;

  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const contextMessage = context ? `${context}: ${errorMessage}` : errorMessage;

    if (logToConsole) {
      console.error(contextMessage, typeof error === 'object' ? error : new Error(error));
    }

    if (showToast) {
      toast.error(contextMessage);
    }
  }, [showToast, logToConsole]);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
