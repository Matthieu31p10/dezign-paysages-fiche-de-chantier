import { ErrorType, ErrorHandlerOptions } from './types';
import { errorHandler } from './index';

// Convenience functions for common use cases
export const handleAuthError = (error: unknown, operation?: string) => {
  return errorHandler.handle(error, {
    context: { type: ErrorType.AUTHENTICATION, operation }
  });
};

export const handleDatabaseError = (error: unknown, operation?: string, additional?: Record<string, unknown>) => {
  return errorHandler.handle(error, {
    context: { type: ErrorType.DATABASE, operation, additional }
  });
};

export const handleNetworkError = (error: unknown, operation?: string) => {
  return errorHandler.handle(error, {
    context: { type: ErrorType.NETWORK, operation }
  });
};

export const handleValidationError = (error: unknown, operation?: string) => {
  return errorHandler.handle(error, {
    context: { type: ErrorType.VALIDATION, operation }
  });
};

export const handleFileUploadError = (error: unknown, operation?: string) => {
  return errorHandler.handle(error, {
    context: { type: ErrorType.FILE_UPLOAD, operation }
  });
};

// Async operation wrapper
export const withErrorHandling = <T>(
  operation: () => Promise<T>,
  options: ErrorHandlerOptions = {}
) => {
  return errorHandler.handleAsync(operation, options);
};