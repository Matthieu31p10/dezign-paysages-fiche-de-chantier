import { createContext, useContext, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

interface ErrorContextType {
  handleError: (error: Error | unknown, context?: string) => void;
  handleAsyncError: <T>(operation: () => Promise<T>, context?: string) => Promise<T | null>;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const handleError = useCallback((error: Error | unknown, context?: string) => {
    const message = error instanceof Error ? error.message : 'Une erreur est survenue';
    
    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'Error'}]:`, error);
    }
    
    // Afficher toast d'erreur
    toast.error(message);
  }, []);

  const handleAsyncError = useCallback(async <T,>(
    operation: () => Promise<T>, 
    context?: string
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [handleError]);

  const value = useMemo(() => ({
    handleError,
    handleAsyncError
  }), [handleError, handleAsyncError]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};