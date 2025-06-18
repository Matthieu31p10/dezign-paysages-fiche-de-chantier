
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { useApp } from '@/context/AppContext';

const TimeDeviationSection: React.FC = () => {
  const { workLog, project } = useWorkLogDetail();
  const { workLogs } = useApp();

  // Vérifier si c'est une fiche vierge
  const isBlankWorksheet = workLog?.projectId && 
    (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));

  if (isBlankWorksheet || !project) {
    return null;
  }

  // Get all work logs for this project to calculate deviation
  const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
  
  // Calculate average team hours per visit (same calculation as in reports)
  const totalTeamHours = projectWorkLogs.reduce((sum, log) => {
    const individualHours = log.timeTracking?.totalHours || 0;
    const personnelCount = log.personnel?.length || 1;
    return sum + (individualHours * personnelCount);
  }, 0);
  
  const averageTeamHoursPerVisit = projectWorkLogs.length > 0 
    ? totalTeamHours / projectWorkLogs.length 
    : 0;
  
  // Calculate deviation: expected duration - average team hours per visit
  const difference = project.visitDuration - averageTeamHoursPerVisit;
  
  let deviationDisplay = "N/A";
  let deviationClass = "text-gray-600";
  
  if (projectWorkLogs.length > 0 && project.visitDuration) {
    deviationDisplay = `${difference >= 0 ? '+' : ''}${difference.toFixed(1)}h`;
    
    if (Math.abs(difference) <= (project.visitDuration * 0.1)) {
      deviationClass = 'text-green-600 font-bold'; // Dans la tolérance (±10%)
    } else if (difference > 0) {
      deviationClass = 'text-amber-600 font-bold'; // Plus rapide que prévu
    } else {
      deviationClass = 'text-red-600 font-bold'; // Plus lent que prévu
    }
  }

  return (
    <div className="p-4 border rounded-md bg-gradient-to-r from-orange-50 to-white border-orange-200">
      <h3 className="text-sm font-medium mb-3 flex items-center text-orange-800">
        <AlertCircle className="w-4 h-4 mr-2" />
        Écart du temps de passage
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Durée prévue:</span>
          <span className="font-medium">{project.visitDuration} h</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Temps moyen (équipe):</span>
          <span className="font-medium">
            {averageTeamHoursPerVisit.toFixed(1)} h
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-orange-200">
          <span className="text-sm font-medium">Écart:</span>
          <span className={deviationClass}>
            {deviationDisplay}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Écart = Durée prévue - Temps moyen par passage (calculé sur {projectWorkLogs.length} passage{projectWorkLogs.length > 1 ? 's' : ''})
      </p>
    </div>
  );
};

export default TimeDeviationSection;
