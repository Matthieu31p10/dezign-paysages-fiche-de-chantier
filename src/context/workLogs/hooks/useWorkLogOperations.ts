import { WorkLog } from '@/types/models';
import { 
  getWorkLogById, 
  getWorkLogsByProjectId, 
  getTotalDuration, 
  getTotalVisits, 
  getLastVisitDate 
} from '../workLogsOperations';
import { 
  addWorkLogToDatabase, 
  updateWorkLogInDatabase 
} from '../workLogsStorage';
import { Dispatch, SetStateAction } from 'react';

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
    
    console.log('Adding new WorkLog to database:', newWorkLog);
    
    try {
      // Ajouter à la base de données
      const savedWorkLog = await addWorkLogToDatabase(newWorkLog);
      
      // Mettre à jour l'état local
      setWorkLogs((prev) => [...prev, savedWorkLog]);
      
      console.log("WorkLog added successfully:", savedWorkLog);
      return savedWorkLog;
    } catch (error) {
      console.error("Error adding WorkLog:", error);
      throw new Error("Erreur lors de l'ajout de la fiche");
    }
  };

  const updateWorkLog = async (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>): Promise<void> => {
    try {
      let workLogToUpdate: WorkLog | undefined;
      
      // Déterminer le WorkLog à mettre à jour
      if (typeof idOrWorkLog === 'string' && partialWorkLog) {
        const id = idOrWorkLog;
        const existingWorkLog = workLogs.find(w => w.id === id);
        
        if (!existingWorkLog) {
          console.error(`WorkLog with ID ${id} not found for update`);
          throw new Error(`Fiche avec ID ${id} introuvable`);
        }
        
        workLogToUpdate = { ...existingWorkLog, ...partialWorkLog };
      } else if (typeof idOrWorkLog !== 'string') {
        workLogToUpdate = idOrWorkLog;
      }
      
      if (!workLogToUpdate) {
        throw new Error("Données de mise à jour invalides");
      }
      
      // Ensure createdAt is a Date object
      workLogToUpdate.createdAt = workLogToUpdate.createdAt instanceof Date 
        ? workLogToUpdate.createdAt 
        : new Date(workLogToUpdate.createdAt);
      
      // Mettre à jour dans la base de données
      const updatedWorkLog = await updateWorkLogInDatabase(workLogToUpdate);
      
      // Mettre à jour l'état local
      setWorkLogs((prev) => 
        prev.map((w) => w.id === updatedWorkLog.id ? updatedWorkLog : w)
      );
      
      console.log("WorkLog updated successfully:", updatedWorkLog);
    } catch (error) {
      console.error("Error updating WorkLog:", error);
      throw error;
    }
  };

  const deleteWorkLog = (id: string): void => {
    // TODO: Implement database version
  };

  const deleteWorkLogsByProjectId = (projectId: string): void => {
    // TODO: Implement database version
  };

  const archiveWorkLogsByProjectId = (projectId: string, archived: boolean): void => {
    // TODO: Implement database version
  };

  const getBlankWorksheets = (): WorkLog[] => {
    // TODO: Implement database version
    return [];
  };

  const getRegularWorkLogs = (): WorkLog[] => {
    // TODO: Implement database version
    return [];
  };

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
    getBlankWorksheets,
    getRegularWorkLogs
  };
};
