
import { WorkLog, ProjectInfo } from '@/types/models';

export const useWorkLogCalculations = (
  workLog?: WorkLog, 
  project?: ProjectInfo,
  workLogs: WorkLog[] = []
) => {
  const calculateEndTime = (): string => {
    if (!workLog || !workLog.timeTracking) return "--:--";
    return workLog.timeTracking.end || "--:--";
  };
  
  const calculateHourDifference = (): string => {
    if (!workLog || !project) return "N/A";
    
    const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
    const completedVisits = projectWorkLogs.length;
    
    if (completedVisits === 0) return "N/A";
    
    const totalHoursCompleted = projectWorkLogs.reduce((total, log) => {
      if (log.timeTracking && typeof log.timeTracking.totalHours === 'number') {
        return total + log.timeTracking.totalHours;
      }
      return total;
    }, 0);
    
    const averageHoursPerVisit = totalHoursCompleted / completedVisits;
    
    if (!project.visitDuration) return "N/A";
    
    const difference = project.visitDuration - averageHoursPerVisit;
    
    const sign = difference >= 0 ? '+' : '';
    return `${sign}${difference.toFixed(2)} h`;
  };
  
  const calculateTotalTeamHours = (): string => {
    if (!workLog || !workLog.timeTracking || typeof workLog.timeTracking.totalHours !== 'number') {
      return "0";
    }
    
    const totalTeamHours = workLog.timeTracking.totalHours;
    return totalTeamHours.toFixed(2);
  };
  
  return {
    calculateEndTime,
    calculateHourDifference,
    calculateTotalTeamHours
  };
};
