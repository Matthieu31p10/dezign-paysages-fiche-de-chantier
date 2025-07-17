export const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return new Error(String(error.message));
  }
  
  return new Error('Une erreur inconnue s\'est produite');
};

export const createError = (message: string, type: string, additional?: Record<string, unknown>): Error => {
  const error = new Error(message);
  (error as any).type = type;
  (error as any).additional = additional;
  return error;
};