
import { WorkLog } from '@/types/models';
import { 
  getWorkLogById, 
  getWorkLogsByProjectId, 
  getTotalDuration, 
  getTotalVisits, 
  getLastVisitDate 
} from '../workLogsOperations';
import { Dispatch, SetStateAction } from 'react';
import { saveWorkLogsToStorage, deleteWorkLogFromStorage } from '../workLogsStorage';
import { toast } from 'sonner';

export const useWorkLogOperations = (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>
) => {
  const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
    if (!workLog.personnel || workLog.personnel.length === 0) {
      console.error("Invalid worklog data (missing personnel):", workLog);
      throw new Error('Personnel requis pour la fiche');
    }
    
    if (!workLog.date) {
      console.error("Invalid worklog data (missing date):", workLog);
      throw new Error('Date requise pour la fiche');
    }
    
    // S'assurer que createdAt est bien un objet Date
    const createdAt = workLog.createdAt instanceof Date ? workLog.createdAt : new Date();
    
    const newWorkLog: WorkLog = {
      ...workLog,
      id: workLog.id || crypto.randomUUID(),
      createdAt,
      isBlankWorksheet: workLog.isBlankWorksheet || false
    };
    
    console.log('Adding new WorkLog to state:', newWorkLog);
    
    try {
      // Mettre à jour l'état local
      const updatedWorkLogs = [...workLogs, newWorkLog];
      setWorkLogs(updatedWorkLogs);
      
      // Sauvegarder dans Supabase
      await saveWorkLogsToStorage([newWorkLog]);
      
      console.log("WorkLog added successfully:", newWorkLog);
      return newWorkLog;
    } catch (error) {
      console.error("Error adding WorkLog:", error);
      throw new Error("Erreur lors de l'ajout de la fiche");
    }
  };

  const updateWorkLog = async (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>): Promise<void> => {
    try {
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
            const updatedWorkLog = { ...w, ...partialWorkLog };
            updatedWorkLog.createdAt = updatedWorkLog.createdAt instanceof Date 
              ? updatedWorkLog.createdAt 
              : new Date(updatedWorkLog.createdAt);
            return updatedWorkLog;
          }
          return w;
        });
      } else if (typeof idOrWorkLog === 'object') {
        const workLog = idOrWorkLog;
        const exists = workLogs.some(w => w.id === workLog.id);
        
        if (!exists) {
          console.error(`WorkLog with ID ${workLog.id} not found for update`);
          throw new Error(`Fiche avec ID ${workLog.id} introuvable`);
        }
        
        // Ensure createdAt is a Date object
        workLog.createdAt = workLog.createdAt instanceof Date 
          ? workLog.createdAt 
          : new Date(workLog.createdAt);
        
        updatedWorkLogs = workLogs.map((w) => (w.id === workLog.id ? workLog : w));
      } else {
        throw new Error("Format invalide pour la mise à jour de la fiche");
      }
      
      // Mettre à jour l'état local
      setWorkLogs(updatedWorkLogs);
      
      // Trouver l'élément mis à jour pour le sauvegarder dans Supabase
      const workLogToUpdate = typeof idOrWorkLog === 'string' 
        ? updatedWorkLogs.find(w => w.id === idOrWorkLog) 
        : idOrWorkLog;
      
      if (workLogToUpdate) {
        await saveWorkLogsToStorage([workLogToUpdate]);
      }
      
    } catch (error) {
      console.error("Error updating WorkLog:", error);
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      throw error;
    }
  };

  const deleteWorkLog = async (id: string) => {
    try {
      // Vérifier si la fiche existe
      if (!workLogs.some(w => w.id === id)) {
        throw new Error(`Fiche avec ID ${id} introuvable`);
      }
      
      // Mettre à jour l'état local
      setWorkLogs((prev) => prev.filter((w) => w.id !== id));
      
      // Supprimer de Supabase
      await deleteWorkLogFromStorage(id);
      
      toast.success('Fiche supprimée avec succès');
    } catch (error) {
      console.error("Error deleting WorkLog:", error);
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      throw error;
    }
  };

  const deleteWorkLogsByProjectId = async (projectId: string) => {
    try {
      // Filtrer les fiches par projet
      const logsToDelete = workLogs.filter(w => w.projectId === projectId);
      
      if (logsToDelete.length === 0) return;
      
      // Mettre à jour l'état local
      setWorkLogs((prev) => prev.filter((w) => w.projectId !== projectId));
      
      // Supprimer chaque fiche de Supabase
      for (const log of logsToDelete) {
        await deleteWorkLogFromStorage(log.id);
      }
      
      toast.success(`${logsToDelete.length} fiches supprimées avec succès`);
    } catch (error) {
      console.error("Error deleting WorkLogs by ProjectId:", error);
      toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const archiveWorkLogsByProjectId = async (projectId: string, archived: boolean) => {
    try {
      const updatedWorkLogs = workLogs.map((w) => {
        if (w.projectId === projectId) {
          return { ...w, isArchived: archived };
        }
        return w;
      });
      
      // Mettre à jour l'état local
      setWorkLogs(updatedWorkLogs);
      
      // Filtrer les fiches modifiées
      const modifiedLogs = updatedWorkLogs.filter(w => w.projectId === projectId);
      
      // Mettre à jour Supabase
      await saveWorkLogsToStorage(modifiedLogs);
      
      toast.success(`${modifiedLogs.length} fiches ${archived ? 'archivées' : 'désarchivées'} avec succès`);
    } catch (error) {
      console.error("Error archiving WorkLogs:", error);
      toast.error(`Erreur lors de l'archivage: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Réutilisation des fonctions d'opérations existantes
  return {
    addWorkLog,
    updateWorkLog,
    deleteWorkLog,
    deleteWorkLogsByProjectId,
    archiveWorkLogsByProjectId,
    getWorkLogById: (id: string) => getWorkLogById(workLogs, id),
    getWorkLogsByProjectId: (projectId: string) => getWorkLogsByProjectId(workLogs, projectId),
    getTotalDuration: (projectId: string) => getTotalDuration(workLogs, projectId),
    getTotalVisits: (projectId: string) => getTotalVisits(workLogs, projectId),
    getLastVisitDate: (projectId: string) => getLastVisitDate(workLogs, projectId),
  };
};
