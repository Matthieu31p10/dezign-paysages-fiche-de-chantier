import { useCallback, useMemo } from 'react';
import { useErrorHandler } from '@/context/ErrorContext';

// Hook simplifié pour les opérations async avec gestion d'erreur
export const useAsyncOperation = () => {
  const { handleAsyncError } = useErrorHandler();

  const execute = useCallback(async <T,>(
    operation: () => Promise<T>,
    options?: {
      context?: string;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<T | null> => {
    const result = await handleAsyncError(operation, options?.context);
    
    if (result !== null && options?.onSuccess) {
      options.onSuccess(result);
    }
    
    return result;
  }, [handleAsyncError]);

  return { execute };
};

// Hook pour la validation de données
export const useDataValidation = () => {
  const { handleError } = useErrorHandler();

  const validate = useCallback(<T,>(
    data: unknown,
    schema: { parse: (data: unknown) => T },
    context?: string
  ): T | null => {
    try {
      return schema.parse(data);
    } catch (error) {
      handleError(error, context || 'Validation');
      return null;
    }
  }, [handleError]);

  return { validate };
};

// Hook pour les opérations de cache avec gestion d'erreur
export const useCachedOperation = <T>(
  key: string,
  operation: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes
) => {
  const { handleAsyncError } = useErrorHandler();
  
  const cache = useMemo(() => new Map<string, { 
    data: T; 
    timestamp: number; 
  }>(), []);

  const execute = useCallback(async (): Promise<T | null> => {
    // Vérifier le cache
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    // Exécuter l'opération avec gestion d'erreur
    const result = await handleAsyncError(operation, `Cache:${key}`);
    
    if (result !== null) {
      cache.set(key, { data: result, timestamp: Date.now() });
    }
    
    return result;
  }, [key, operation, ttl, cache, handleAsyncError]);

  const invalidate = useCallback(() => {
    cache.delete(key);
  }, [key, cache]);

  return { execute, invalidate };
};