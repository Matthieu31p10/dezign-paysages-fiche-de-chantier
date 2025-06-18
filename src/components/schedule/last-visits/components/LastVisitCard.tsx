
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, AlertTriangle, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LastVisitInfo } from '../types';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useApp } from '@/context/AppContext';

interface LastVisitCardProps {
  visitInfo: LastVisitInfo;
}

const LastVisitCard: React.FC<LastVisitCardProps> = ({ visitInfo }) => {
  const { projectName, lastVisitDate, daysSinceLastVisit, address, projectId } = visitInfo;
  const { getWorkLogsByProjectId } = useWorkLogs();
  const { getProjectById } = useApp();

  const project = getProjectById(projectId);
  const projectWorkLogs = getWorkLogsByProjectId(projectId);
  
  // Calculate completed vs planned visits
  const completedVisits = projectWorkLogs.length;
  const plannedVisits = project?.annualVisits || 0;
  
  // Calculate time deviation
  let timeDeviation = null;
  let timeDeviationClass = 'text-gray-600';
  
  if (project && project.visitDuration && projectWorkLogs.length > 0) {
    const totalHours = projectWorkLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
    const averageHours = totalHours / projectWorkLogs.length;
    const deviation = averageHours - project.visitDuration;
    
    timeDeviation = deviation === 0 
      ? "Pas d'écart" 
      : `${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}h`;
    
    timeDeviationClass = deviation === 0 
      ? 'text-gray-600' 
      : (deviation > 0 ? 'text-amber-600' : 'text-green-600');
    
    if (Math.abs(deviation) <= (project.visitDuration * 0.1)) {
      timeDeviationClass = 'text-green-600';
    }
  }

  const getBadgeVariant = (days: number | null) => {
    if (days === null) return 'destructive';
    if (days > 30) return 'destructive';
    if (days > 14) return 'secondary';
    return 'default';
  };

  const getBadgeText = (days: number | null) => {
    if (days === null) return 'Aucun passage';
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    return `Il y a ${days} jours`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">{projectName}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{address}</span>
            </div>
            {lastVisitDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Dernier passage : {format(lastVisitDate, "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
            
            {/* New: Time deviation display */}
            {timeDeviation && (
              <div className="flex items-center gap-2 text-sm mb-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Écart temps :</span>
                <span className={`font-medium ${timeDeviationClass}`}>
                  {timeDeviation}
                </span>
              </div>
            )}
            
            {/* New: Visits count display */}
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Passages :</span>
              <span className="font-medium text-blue-600">
                {completedVisits}/{plannedVisits}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getBadgeVariant(daysSinceLastVisit)}>
              {getBadgeText(daysSinceLastVisit)}
            </Badge>
            {daysSinceLastVisit && daysSinceLastVisit > 30 && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastVisitCard;
