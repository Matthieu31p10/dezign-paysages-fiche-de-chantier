import { ErrorContext } from './types';

export const logError = (error: Error, context?: ErrorContext): void => {
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
};

export const reportError = (error: Error, context?: ErrorContext): void => {
  // In a real app, you would send this to services like:
  // - Sentry
  // - LogRocket  
  // - Custom analytics endpoint
  // - etc.
  
  if (import.meta.env.DEV) {
    console.log('📊 Would report to external service:', { error, context });
  }
};