
import { WorkLog } from '@/types/models';
import { Dispatch, SetStateAction } from 'react';
import { saveWorkLogsToStorage } from '../../workLogsStorage';
import { toast } from 'sonner';

/**
 * Update an existing WorkLog
 */
export const updateWorkLog = async (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>, 
  idOrWorkLog: string | WorkLog, 
  partialWorkLog?: Partial<WorkLog>
): Promise<void> => {
  try {
    let updatedWorkLog: WorkLog;
    let updatedWorkLogs: WorkLog[] = [];
    
    if (typeof idOrWorkLog === 'string' && partialWorkLog) {
      const id = idOrWorkLog;
      const exists = workLogs.some(w => w.id === id);
      
      if (!exists) {
        console.error(`WorkLog with ID ${id} not found for update`);
        throw new Error(`Fiche avec ID ${id} introuvable`);
      }
      
      updatedWorkLogs = workLogs.map((w) => {
        if (w.id === id) {
          // Ensure createdAt remains a Date object
          const updated = { ...w, ...partialWorkLog };
          updated.createdAt = updated.createdAt instanceof Date 
            ? updated.createdAt 
            : new Date(updated.createdAt);
          updatedWorkLog = updated;
          return updated;
        }
        return w;
      });
    } else if (typeof idOrWorkLog === 'object') {
      updatedWorkLog = idOrWorkLog;
      const exists = workLogs.some(w => w.id === updatedWorkLog.id);
      
      if (!exists) {
        console.error(`WorkLog with ID ${updatedWorkLog.id} not found for update`);
        throw new Error(`Fiche avec ID ${updatedWorkLog.id} introuvable`);
      }
      
      // Ensure createdAt is a Date object
      updatedWorkLog.createdAt = updatedWorkLog.createdAt instanceof Date 
        ? updatedWorkLog.createdAt 
        : new Date(updatedWorkLog.createdAt);
      
      updatedWorkLogs = workLogs.map((w) => (w.id === updatedWorkLog.id ? updatedWorkLog : w));
    } else {
      throw new Error("Format invalide pour la mise à jour de la fiche");
    }
    
    // Sauvegarder dans Supabase d'abord
    await saveWorkLogsToStorage([updatedWorkLog!]);
    
    // Puis mettre à jour l'état local
    setWorkLogs(updatedWorkLogs);
    
  } catch (error) {
    console.error("Error updating WorkLog:", error);
    toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};
