import { toast } from 'sonner';
import { ErrorHandlerOptions } from './types';
import { normalizeError } from './errorNormalizer';
import { getErrorMessage } from './errorMessages';
import { logError, reportError } from './errorLogger';

class ErrorHandler {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Handle errors in a centralized way
   */
  handle(error: Error | unknown, options: ErrorHandlerOptions = {}) {
    const {
      showToast = true,
      logToConsole = true,
      userMessage,
      context
    } = options;

    // Normalize error
    const normalizedError = normalizeError(error);
    
    // Log to console in development or if explicitly requested
    if (logToConsole && (this.isDevelopment || import.meta.env.VITE_ENABLE_ERROR_LOGGING)) {
      logError(normalizedError, context);
    }

    // Show user-friendly toast notification
    if (showToast) {
      const message = userMessage || getErrorMessage(normalizedError, context);
      toast.error(message);
    }

    // In production, you might want to send to external logging service
    if (!this.isDevelopment) {
      reportError(normalizedError, context);
    }

    return normalizedError;
  }

  /**
   * Handle async operations with automatic error handling
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, options);
      return null;
    }
  }
}

export { ErrorHandler };