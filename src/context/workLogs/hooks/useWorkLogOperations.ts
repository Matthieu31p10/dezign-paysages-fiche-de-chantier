
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
    
    const newWorkLog: WorkLog = {
      ...workLog,
      id: workLog.id || crypto.randomUUID(),
      createdAt: new Date(), // Ensure createdAt is a Date object
    };
    
    console.log('Adding new WorkLog:', newWorkLog);
    
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
        
        return prev.map((w) => w.id === id ? { ...w, ...partialWorkLog } : w);
      }
      
      if (typeof idOrWorkLog !== 'string') {
        const workLog = idOrWorkLog;
        const exists = prev.some(w => w.id === workLog.id);
        
        if (!exists) {
          console.error(`WorkLog with ID ${workLog.id} not found for update`);
          throw new Error(`Fiche de suivi avec ID ${workLog.id} introuvable`);
        }
        
        return prev.map((w) => w.id === workLog.id ? workLog : w);
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
