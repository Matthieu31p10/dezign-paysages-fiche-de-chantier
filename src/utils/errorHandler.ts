
export const handleError = (error: unknown, context: string = 'Unknown'): void => {
  console.error(`Error in ${context}:`, error);
  
  // En production, on pourrait envoyer l'erreur à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Exemple : Sentry.captureException(error);
  }
};

export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  context: string = 'Unknown operation'
): T => {
  try {
    return fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
};

export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  context: string = 'Unknown async operation'
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
};
