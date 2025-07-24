
import { WorkLog } from '@/types/models';
import { 
  getWorkLogById as getWorkLogByIdUtil,
  getWorkLogsByProjectId as getWorkLogsByProjectIdUtil,
  getTotalHours,
  getTotalVisits as getTotalVisitsUtil,
  getLastVisitDate as getLastVisitDateUtil
} from '@/utils/workLogUtils';

export const useWorkLogQueries = (workLogs: WorkLog[]) => {
  const getWorkLogById = (id: string) => {
    return getWorkLogByIdUtil(workLogs, id);
  };

  const getWorkLogsByProjectId = (projectId: string) => {
    return getWorkLogsByProjectIdUtil(workLogs, projectId);
  };

  const getTotalDuration = (projectId: string) => {
    return getTotalHours(workLogs, projectId);
  };

  const getTotalVisits = (projectId: string) => {
    return getTotalVisitsUtil(workLogs, projectId);
  };

  const getLastVisitDate = (projectId: string) => {
    return getLastVisitDateUtil(workLogs, projectId);
  };

  return {
    getWorkLogById,
    getWorkLogsByProjectId,
    getTotalDuration,
    getTotalVisits,
    getLastVisitDate
  };
};
