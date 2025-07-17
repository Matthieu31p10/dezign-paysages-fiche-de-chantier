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