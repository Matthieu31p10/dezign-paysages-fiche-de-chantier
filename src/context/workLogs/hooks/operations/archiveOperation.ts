
import { WorkLog } from '@/types/models';
import { Dispatch, SetStateAction } from 'react';
import { saveWorkLogsToStorage } from '../../workLogsStorage';
import { toast } from 'sonner';

/**
 * Archive or unarchive all WorkLogs for a project
 */
export const archiveWorkLogsByProjectId = async (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>,
  projectId: string, 
  archived: boolean
): Promise<void> => {
  try {
    const logsToUpdate = workLogs.filter(w => w.projectId === projectId);
    
    if (logsToUpdate.length === 0) return;
    
    const updatedWorkLogs = workLogs.map((w) => {
      if (w.projectId === projectId) {
        return { ...w, isArchived: archived };
      }
      return w;
    });
    
    // Mettre à jour chaque fiche dans Supabase
    for (const log of logsToUpdate) {
      await saveWorkLogsToStorage([{ ...log, isArchived: archived }]);
    }
    
    // Puis mettre à jour l'état local
    setWorkLogs(updatedWorkLogs);
    
    toast.success(`${logsToUpdate.length} fiches ${archived ? 'archivées' : 'désarchivées'} avec succès`);
  } catch (error) {
    console.error("Error archiving WorkLogs:", error);
    toast.error(`Erreur lors de l'archivage: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};
