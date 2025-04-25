
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
    if (!workLog.projectId || !workLog.date || !workLog.personnel || workLog.personnel.length === 0) {
      console.error("Invalid worklog data:", workLog);
      throw new Error('Données invalides pour la fiche de suivi');
    }
    
    const newWorkLog: WorkLog = {
      ...workLog,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
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
    setWorkLogs((prev) => {
      const exists = prev.some(w => w.id === id);
      if (!exists) {
        console.error(`WorkLog with ID ${id} not found for deletion`);
      }
      return prev.filter((w) => w.id !== id);
    });
    console.log("WorkLog deleted successfully:", id);
  };

  return {
    addWorkLog,
    updateWorkLog,
    deleteWorkLog,
    getWorkLogById: (id: string) => getWorkLogById(workLogs, id),
    getWorkLogsByProjectId: (projectId: string) => getWorkLogsByProjectId(workLogs, projectId),
    getTotalDuration: (projectId: string) => getTotalDuration(workLogs, projectId),
    getTotalVisits: (projectId: string) => getTotalVisits(workLogs, projectId),
    getLastVisitDate: (projectId: string) => getLastVisitDate(workLogs, projectId),
  };
};
