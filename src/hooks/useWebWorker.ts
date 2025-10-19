import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook générique pour utiliser un Web Worker
 */
export function useWebWorker<TMessage, TResponse>(
  workerFactory: () => Worker,
  options: {
    onMessage?: (response: TResponse) => void;
    onError?: (error: Error) => void;
    autoTerminate?: boolean;
  } = {}
) {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize worker
  useEffect(() => {
    try {
      workerRef.current = workerFactory();
      setIsReady(true);

      // Handle messages from worker
      workerRef.current.onmessage = (event: MessageEvent<TResponse>) => {
        options.onMessage?.(event.data);
      };

      // Handle errors
      workerRef.current.onerror = (event: ErrorEvent) => {
        const error = new Error(event.message);
        setError(error);
        options.onError?.(error);
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize worker');
      setError(error);
      options.onError?.(error);
    }

    // Cleanup
    return () => {
      if (workerRef.current && options.autoTerminate !== false) {
        workerRef.current.terminate();
        workerRef.current = null;
        setIsReady(false);
      }
    };
  }, []);

  // Send message to worker
  const postMessage = useCallback((message: TMessage) => {
    if (!workerRef.current || !isReady) {
      console.warn('Worker not ready yet');
      return;
    }

    try {
      workerRef.current.postMessage(message);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to post message to worker');
      setError(error);
      options.onError?.(error);
    }
  }, [isReady, options]);

  // Terminate worker manually
  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsReady(false);
    }
  }, []);

  return {
    postMessage,
    terminate,
    isReady,
    error
  };
}
