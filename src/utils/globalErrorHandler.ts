import { ErrorLogger } from './errorHandler';

// Handler pour les erreurs JavaScript non capturées
const handleUnhandledError = (event: ErrorEvent) => {
  ErrorLogger.log(
    event.error || new Error(event.message),
    'critical',
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'unhandled_error',
    }
  );
};

// Handler pour les promesses rejetées non capturées
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  ErrorLogger.log(
    event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason)),
    'critical',
    {
      type: 'unhandled_rejection',
    }
  );
  
  // Empêcher l'affichage par défaut du navigateur
  event.preventDefault();
};

// Initialiser les listeners globaux
export const initializeGlobalErrorHandling = () => {
  // Erreurs JavaScript non capturées
  window.addEventListener('error', handleUnhandledError);
  
  // Promesses rejetées non capturées
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  // Console.error override pour capturer les erreurs logguées
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Appeler la fonction originale
    originalConsoleError.apply(console, args);
    
    // Logger dans notre système si c'est une erreur
    if (args.length > 0 && args[0] instanceof Error) {
      ErrorLogger.log(args[0], 'medium', {
        type: 'console_error',
        additionalArgs: args.slice(1),
      });
    }
  };
};

// Cleanup des listeners
export const cleanupGlobalErrorHandling = () => {
  window.removeEventListener('error', handleUnhandledError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
};