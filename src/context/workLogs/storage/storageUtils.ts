
import { toast } from 'sonner';

// Mock storage for browser environment
export let localWorkLogs: any[] = [];
export let localConsumables: any[] = [];

// Safe check for browser environment
export const isBrowser = typeof window !== 'undefined' && !('process' in window);

// Format error handling
export const handleStorageError = (error: any, message: string): void => {
  console.error(`Error ${message}:`, error);
  toast.error(`Erreur lors de ${message}`);
};
