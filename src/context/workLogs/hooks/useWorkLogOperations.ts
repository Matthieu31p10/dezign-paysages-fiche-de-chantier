
import { WorkLog } from '@/types/models';
import { 
  getWorkLogById, 
  getWorkLogsByProjectId, 
  getTotalDuration, 
  getTotalVisits, 
  getLastVisitDate 
} from '../workLogsOperations';
import { Dispatch, SetStateAction } from 'react';

export const useWorkLogOperations = (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>
) => {
  const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
    if (!workLog.personnel || workLog.personnel.length === 0) {
      console.error("Invalid worklog data (missing personnel):", workLog);
      throw new Error('Personnel requis pour la fiche de suivi');
    }
    
    if (!workLog.date) {
      console.error("Invalid worklog data (missing date):", workLog);
      throw new Error('Date requise pour la fiche de suivi');
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
    
    setWorkLogs((prev) => [...prev, newWorkLog]);
    console.log("WorkLog added successfully:", newWorkLog);
    return newWorkLog;
  };

  const updateWorkLog = async (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>): Promise<void> => {
    setWorkLogs((prev) => {
      if (typeof idOrWorkLog === 'string' && partialWorkLog) {
        const id = idOrWorkLog;
        const exists = prev.some(w => w.id === id);
        
        if (!exists) {
          console.error(`WorkLog with ID ${id} not found for update`);
          throw new Error(`Fiche de suivi avec ID ${id} introuvable`);
        }
        
        return prev.map((w) => {
          if (w.id === id) {
            // Ensure createdAt remains a Date object
            const updatedWorkLog = { ...w, ...partialWorkLog };
            updatedWorkLog.createdAt = updatedWorkLog.createdAt instanceof Date 
              ? updatedWorkLog.createdAt 
              : new Date(updatedWorkLog.createdAt);
            
            // Preserve the isBlankWorksheet flag
            updatedWorkLog.isBlankWorksheet = 
              partialWorkLog.isBlankWorksheet !== undefined 
                ? partialWorkLog.isBlankWorksheet 
                : w.isBlankWorksheet;
            
            return updatedWorkLog;
          }
          return w;
        });
      }
      
      if (typeof idOrWorkLog !== 'string') {
        const workLog = idOrWorkLog;
        const exists = prev.some(w => w.id === workLog.id);
        
        if (!exists) {
          console.error(`WorkLog with ID ${workLog.id} not found for update`);
          throw new Error(`Fiche de suivi avec ID ${workLog.id} introuvable`);
        }
        
        // Ensure createdAt is a Date object
        const updatedWorkLog = { ...workLog };
        updatedWorkLog.createdAt = workLog.createdAt instanceof Date 
          ? workLog.createdAt 
          : new Date(workLog.createdAt);
        
        // Preserve the isBlankWorksheet flag if it already exists
        const originalWorkLog = prev.find(w => w.id === workLog.id);
        if (originalWorkLog) {
          updatedWorkLog.isBlankWorksheet = 
            updatedWorkLog.isBlankWorksheet !== undefined 
              ? updatedWorkLog.isBlankWorksheet 
              : originalWorkLog.isBlankWorksheet;
        }
        
        return prev.map((w) => w.id === updatedWorkLog.id ? updatedWorkLog : w);
      }
      
      return prev;
    });
  };

  const deleteWorkLog = (id: string): void => {
    setWorkLogs((prev) => prev.filter((w) => w.id !== id));
  };

  // Adding the missing methods
  const deleteWorkLogsByProjectId = (projectId: string): void => {
    setWorkLogs((prev) => prev.filter((w) => w.projectId !== projectId));
  };

  const archiveWorkLogsByProjectId = (projectId: string, archived: boolean): void => {
    setWorkLogs((prev) => 
      prev.map((w) => w.projectId === projectId ? { ...w, isArchived: archived } : w)
    );
  };

  // Méthode pour filtrer les fiches vierges
  const getBlankWorksheets = (): WorkLog[] => {
    return workLogs.filter(workLog => workLog.isBlankWorksheet === true);
  };
  
  // Méthode pour filtrer les fiches de suivi (non vierges)
  const getRegularWorkLogs = (): WorkLog[] => {
    return workLogs.filter(workLog => workLog.isBlankWorksheet !== true);
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
