
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { useApp } from '@/context/AppContext';
import { calculateTimeDeviation } from '@/utils/statistics';

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
  
  // Use the statistics utility to calculate time deviation
  const timeDeviation = calculateTimeDeviation(project.visitDuration || 0, projectWorkLogs);

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
            {projectWorkLogs.length > 0 
              ? ((projectWorkLogs.reduce((sum, log) => {
                  const individualHours = log.timeTracking?.totalHours || 0;
                  const personnelCount = log.personnel?.length || 1;
                  return sum + (individualHours * personnelCount);
                }, 0) / projectWorkLogs.length).toFixed(2))
              : '0.00'
            } h
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-orange-200">
          <span className="text-sm font-medium">Écart:</span>
          <span className={`font-bold ${timeDeviation.className}`}>
            {timeDeviation.display}
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
