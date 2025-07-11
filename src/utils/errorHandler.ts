import { toast } from 'sonner';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
}

export class ErrorLogger {
  private static errors: ErrorInfo[] = [];
  private static maxErrors = 100;

  static log(error: Error | string, severity: ErrorSeverity = 'medium', context?: Record<string, unknown>) {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity,
      context,
    };

    // Ajouter à la queue locale
    this.errors.unshift(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorLogger]', errorInfo);
    }

    // Affichage utilisateur selon la sévérité
    this.showUserNotification(errorInfo);

    // TODO: Envoyer à un service de monitoring externe
    // this.sendToMonitoring(errorInfo);
  }

  private static showUserNotification(error: ErrorInfo) {
    switch (error.severity) {
      case 'critical':
        toast.error('Erreur critique: ' + error.message, {
          duration: 10000,
          action: {
            label: 'Signaler',
            onClick: () => this.reportError(error),
          },
        });
        break;
      case 'high':
        toast.error('Erreur: ' + error.message, {
          duration: 6000,
        });
        break;
      case 'medium':
        toast.warning('Attention: ' + error.message, {
          duration: 4000,
        });
        break;
      case 'low':
        toast.info(error.message, {
          duration: 2000,
        });
        break;
    }
  }

  private static reportError(error: ErrorInfo) {
    // Copier les détails de l'erreur dans le presse-papiers
    const errorReport = JSON.stringify(error, null, 2);
    navigator.clipboard.writeText(errorReport).then(() => {
      toast.success('Détails de l\'erreur copiés dans le presse-papiers');
    });
  }

  static getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  static clearErrors() {
    this.errors = [];
  }

  static getErrorStats() {
    const now = Date.now();
    const last24h = this.errors.filter(e => now - e.timestamp < 24 * 60 * 60 * 1000);
    const lastHour = this.errors.filter(e => now - e.timestamp < 60 * 60 * 1000);

    return {
      total: this.errors.length,
      last24h: last24h.length,
      lastHour: lastHour.length,
      bySeverity: {
        critical: this.errors.filter(e => e.severity === 'critical').length,
        high: this.errors.filter(e => e.severity === 'high').length,
        medium: this.errors.filter(e => e.severity === 'medium').length,
        low: this.errors.filter(e => e.severity === 'low').length,
      },
    };
  }
}

// Helper pour les erreurs async
export const withErrorHandler = async <T>(
  fn: () => Promise<T>,
  context?: Record<string, unknown>,
  severity: ErrorSeverity = 'medium'
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    ErrorLogger.log(error as Error, severity, context);
    return null;
  }
};

// Helper pour les erreurs de requêtes Supabase
export const handleSupabaseError = (error: any, operation: string) => {
  ErrorLogger.log(
    `Erreur Supabase lors de ${operation}: ${error?.message || 'Erreur inconnue'}`,
    'high',
    { operation, error }
  );
};

// Helper pour les erreurs de validation
export const handleValidationError = (field: string, message: string) => {
  ErrorLogger.log(
    `Validation échouée pour ${field}: ${message}`,
    'medium',
    { field, type: 'validation' }
  );
};