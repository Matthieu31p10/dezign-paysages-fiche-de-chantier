
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
    
    // Filtrer les fiches de suivi pour ce projet
    const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
    const numberOfVisits = projectWorkLogs.length;
    
    if (numberOfVisits === 0) return "N/A";
    
    // Calculer le total des heures effectuées pour ce projet
    const totalHours = projectWorkLogs.reduce((total, log) => {
      if (log.timeTracking && typeof log.timeTracking.totalHours === 'number') {
        return total + log.timeTracking.totalHours;
      }
      return total;
    }, 0);
    
    // Moyenne des heures par passage
    const averageHoursPerVisit = totalHours / numberOfVisits;
    
    if (!project.visitDuration) return "N/A";
    
    // Calcul selon la formule: Durée prévue - (Heures effectuées / nombre de passages)
    const deviation = project.visitDuration - averageHoursPerVisit;
    
    const sign = deviation >= 0 ? '+' : '';
    return `${sign}${deviation.toFixed(2)} h`;
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
