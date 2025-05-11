
import { WorkLog } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { toast } from 'sonner';
import { isBrowser, getLocalWorkLogs, setLocalWorkLogs, handleStorageError } from './storageUtils';

/**
 * Load workLogs from database or local storage
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    console.log("Loading work logs");
    
    if (isBrowser) {
      // Browser: try to load from localStorage
      try {
        const storedWorkLogs = localStorage.getItem('workLogs');
        if (storedWorkLogs) {
          const parsedLogs = JSON.parse(storedWorkLogs).map((log: any) => ({
            ...log,
            createdAt: new Date(log.createdAt)
          }));
          setLocalWorkLogs(parsedLogs);
        }
        const localLogs = getLocalWorkLogs();
        console.log(`Loaded ${localLogs.length} work logs from localStorage`);
        return localLogs;
      } catch (e) {
        console.error('Error loading from localStorage:', e);
        return [];
      }
    }
    
    // Server: use Prisma
    try {
      const workLogs = await prisma.workLog.findMany({
        include: {
          consumables: true
        }
      });
      
      return workLogs.map(workLog => ({
        ...workLog,
        createdAt: new Date(workLog.createdAt),
        date: workLog.date.toISOString(),
        timeTracking: {
          departure: workLog.departure || '',
          arrival: workLog.arrival || '',
          end: workLog.end || '',
          breakTime: workLog.breakTime || '',
          totalHours: workLog.totalHours
        }
      }));
    } catch (e) {
      console.error('Error loading from database:', e);
      return [];
    }
  } catch (error) {
    handleStorageError(error, 'du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Save workLogs to database or local storage
 */
export const saveWorkLogsToStorage = async (workLogs: WorkLog[]): Promise<void> => {
  try {
    console.log("Saving work logs:", workLogs);
    
    if (isBrowser) {
      // Browser: save to localStorage
      try {
        setLocalWorkLogs(workLogs);
        localStorage.setItem('workLogs', JSON.stringify(workLogs));
        console.log(`Saved ${workLogs.length} work logs to localStorage`);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
        toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
      }
      return;
    }
    
    // In a Node.js environment, we would implement database operations here
    console.log("In server environment, would save workLogs to database:", workLogs);
  } catch (error) {
    handleStorageError(error, 'de l\'enregistrement des fiches de suivi');
  }
};
