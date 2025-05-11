
import { WorkLog } from '@/types/models';
import { 
  getWorkLogById, 
  getWorkLogsByProjectId, 
  getTotalDuration, 
  getTotalVisits, 
  getLastVisitDate 
} from '../workLogsOperations';
import { Dispatch, SetStateAction } from 'react';
import { addWorkLog } from './operations/addOperation';
import { updateWorkLog } from './operations/updateOperation';
import { deleteWorkLog, deleteWorkLogsByProjectId } from './operations/deleteOperation';
import { archiveWorkLogsByProjectId } from './operations/archiveOperation';

/**
 * Hook for WorkLog operations
 */
export const useWorkLogOperations = (
  workLogs: WorkLog[],
  setWorkLogs: Dispatch<SetStateAction<WorkLog[]>>
) => {
  return {
    // CRUD operations
    addWorkLog: (workLog: WorkLog) => addWorkLog(workLogs, setWorkLogs, workLog),
    updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => 
      updateWorkLog(workLogs, setWorkLogs, idOrWorkLog, partialWorkLog),
    deleteWorkLog: (id: string) => deleteWorkLog(workLogs, setWorkLogs, id),
    deleteWorkLogsByProjectId: (projectId: string) => 
      deleteWorkLogsByProjectId(workLogs, setWorkLogs, projectId),
    archiveWorkLogsByProjectId: (projectId: string, archived: boolean) => 
      archiveWorkLogsByProjectId(workLogs, setWorkLogs, projectId, archived),
    
    // Query operations
    getWorkLogById: (id: string) => getWorkLogById(workLogs, id),
    getWorkLogsByProjectId: (projectId: string) => getWorkLogsByProjectId(workLogs, projectId),
    getTotalDuration: (projectId: string) => getTotalDuration(workLogs, projectId),
    getTotalVisits: (projectId: string) => getTotalVisits(workLogs, projectId),
    getLastVisitDate: (projectId: string) => getLastVisitDate(workLogs, projectId),
  };
};
