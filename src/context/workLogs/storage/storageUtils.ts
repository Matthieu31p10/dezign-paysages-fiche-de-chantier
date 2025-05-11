
import { toast } from 'sonner';

// Mock storage for browser environment
let _localWorkLogs: any[] = [];
let _localConsumables: any[] = [];

// Getter functions to access the local storage
export const getLocalWorkLogs = (): any[] => _localWorkLogs;
export const getLocalConsumables = (): any[] => _localConsumables;

// Update functions to modify the local storage
export const setLocalWorkLogs = (workLogs: any[]): void => {
  _localWorkLogs = workLogs;
};

export const setLocalConsumables = (consumables: any[]): void => {
  _localConsumables = consumables;
};

// Safe check for browser environment
export const isBrowser = typeof window !== 'undefined' && !('process' in window);

// Format error handling
export const handleStorageError = (error: any, message: string): void => {
  console.error(`Error ${message}:`, error);
  toast.error(`Erreur lors de ${message}`);
};
