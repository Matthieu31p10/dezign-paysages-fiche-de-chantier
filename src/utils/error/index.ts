import { ErrorHandler } from './errorHandler';
import { createError } from './errorNormalizer';

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Temporary backward compatibility export (can be removed after cache clears)
export const ErrorLogger = errorHandler;

// Re-export all types and functions
export * from './types';
export * from './convenienceFunctions';
export { createError };