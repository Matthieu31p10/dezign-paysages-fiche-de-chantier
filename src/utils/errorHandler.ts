import { toast } from 'sonner';

export enum ErrorType {
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  NETWORK = 'network',
  VALIDATION = 'validation',
  FILE_UPLOAD = 'file_upload',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

export interface ErrorContext {
  type: ErrorType;
  operation?: string;
  userId?: string;
  projectId?: string;
  additional?: Record<string, unknown>;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  userMessage?: string;
  context?: ErrorContext;
}

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
    const normalizedError = this.normalizeError(error);
    
    // Log to console in development or if explicitly requested
    if (logToConsole && (this.isDevelopment || import.meta.env.VITE_ENABLE_ERROR_LOGGING)) {
      this.logError(normalizedError, context);
    }

    // Show user-friendly toast notification
    if (showToast) {
      const message = userMessage || this.getErrorMessage(normalizedError, context);
      toast.error(message);
    }

    // In production, you might want to send to external logging service
    if (!this.isDevelopment) {
      this.reportError(normalizedError, context);
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

  /**
   * Normalize different error types to a consistent format
   */
  private normalizeError(error: unknown): Error {
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
  }

  /**
   * Get user-friendly error message based on context
   */
  private getErrorMessage(error: Error, context?: ErrorContext): string {
    const type = context?.type || ErrorType.UNKNOWN;
    
    // Supabase specific errors
    if (error.message.includes('PGRST') || error.message.includes('row level security')) {
      return 'Erreur d\'accès aux données. Vérifiez vos permissions.';
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Erreur de connexion. Vérifiez votre connexion internet.';
    }

    switch (type) {
      case ErrorType.AUTHENTICATION:
        return 'Erreur d\'authentification. Veuillez vous reconnecter.';
      case ErrorType.DATABASE:
        return 'Erreur de base de données. L\'opération a échoué.';
      case ErrorType.NETWORK:
        return 'Erreur de réseau. Vérifiez votre connexion.';
      case ErrorType.VALIDATION:
        return 'Données invalides. Vérifiez vos saisies.';
      case ErrorType.FILE_UPLOAD:
        return 'Erreur lors du téléchargement du fichier.';
      case ErrorType.PERMISSION:
        return 'Permissions insuffisantes pour cette opération.';
      default:
        return 'Une erreur s\'est produite. Veuillez réessayer.';
    }
  }

  /**
   * Log error with context information
   */
  private logError(error: Error, context?: ErrorContext) {
    const logData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: context || {},
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.group(`🚨 Error [${context?.type || 'UNKNOWN'}]`);
    console.error('Message:', error.message);
    if (context?.operation) console.log('Operation:', context.operation);
    if (context?.additional) console.log('Additional:', context.additional);
    console.log('Full context:', logData);
    console.groupEnd();
  }

  /**
   * Report error to external service (placeholder)
   */
  private reportError(error: Error, context?: ErrorContext) {
    // In a real app, you would send this to services like:
    // - Sentry
    // - LogRocket  
    // - Custom analytics endpoint
    // - etc.
    
    if (this.isDevelopment) {
      console.log('📊 Would report to external service:', { error, context });
    }
  }

  /**
   * Create a typed error with context
   */
  createError(message: string, type: ErrorType, additional?: Record<string, unknown>): Error {
    const error = new Error(message);
    (error as any).type = type;
    (error as any).additional = additional;
    return error;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

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