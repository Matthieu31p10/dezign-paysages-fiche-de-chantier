
import { WorkLog } from '@/types/models';
import { toast } from 'sonner';

// Local storage key
export const WORKLOGS_STORAGE_KEY = 'landscaping-worklogs';

/**
 * Load workLogs from localStorage
 */
export const loadWorkLogsFromStorage = (): WorkLog[] => {
  try {
    const storedWorkLogs = localStorage.getItem(WORKLOGS_STORAGE_KEY);
    if (storedWorkLogs) {
      const parsedLogs = JSON.parse(storedWorkLogs);
      console.log("Loaded work logs from storage:", parsedLogs);
      return parsedLogs;
    }
    return [];
  } catch (error) {
    console.error('Error loading work logs from localStorage:', error);
    toast.error('Erreur lors du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Save workLogs to localStorage
 */
export const saveWorkLogsToStorage = (workLogs: WorkLog[]): void => {
  try {
    localStorage.setItem(WORKLOGS_STORAGE_KEY, JSON.stringify(workLogs));
    console.log("Saved work logs to storage:", workLogs);
  } catch (error) {
    console.error('Error saving work logs to localStorage:', error);
    toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
  }
};
