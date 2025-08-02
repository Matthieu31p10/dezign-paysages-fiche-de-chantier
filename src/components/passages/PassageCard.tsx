import React from 'react';
import { Badge } from '@/components/ui/badge';
import { safeFormatDate, safeDateDifference } from '@/utils/dateUtils';
import { WorkLog } from '@/types/models';
import { Clock, MapPin, Users, Wrench, Droplets, AlertTriangle, CheckCircle } from 'lucide-react';

interface PassageCardProps {
  passage: WorkLog;
  getProjectName: (projectId: string) => string;
}

export const PassageCard: React.FC<PassageCardProps> = ({ passage, getProjectName }) => {
  const today = new Date();
  const daysAgo = safeDateDifference(today, passage.date) ?? 0;

  const formatPassageDate = (dateString: string) => {
    return safeFormatDate(dateString, 'EEEE d MMMM yyyy', 'Date invalide');
  };

  const getPassageStatus = (days: number) => {
    if (days === 0) return {
      variant: 'default' as const,
      style: 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      textColor: 'text-green-800 dark:text-green-200'
    };
    if (days <= 7) return {
      variant: 'secondary' as const,
      style: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      textColor: 'text-blue-800 dark:text-blue-200'
    };
    if (days <= 30) return {
      variant: 'outline' as const,
      style: 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/50',
      textColor: 'text-orange-800 dark:text-orange-200'
    };
    return {
      variant: 'destructive' as const,
      style: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20',
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/50',
      textColor: 'text-red-800 dark:text-red-200'
    };
  };

  const status = getPassageStatus(daysAgo);
  const StatusIcon = status.icon;

  return (
    <div className={`border border-border rounded-lg p-4 bg-background hover:bg-muted/50 transition-all duration-300 hover:shadow-md ${status.style}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-foreground text-lg">{getProjectName(passage.projectId)}</h3>
            <Badge variant="outline" className="text-xs font-medium">
              #{passage.projectId.slice(-6)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatPassageDate(passage.date)}</span>
            </div>
            
            {passage.personnel && passage.personnel.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{passage.personnel.join(', ')}</span>
              </div>
            )}
            
            {passage.tasks && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="h-4 w-4" />
                <span className="truncate">{passage.tasks}</span>
              </div>
            )}
            
            {passage.address && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{passage.address}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <Badge 
            className={`flex items-center gap-2 text-sm px-3 py-2 ${status.bgColor} ${status.textColor} border-0`}
          >
            <StatusIcon className="h-4 w-4" />
            {daysAgo === 0 ? "Aujourd'hui" : 
             daysAgo === 1 ? "Hier" : 
             `Il y a ${daysAgo} jours`}
          </Badge>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-foreground font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{passage.timeTracking?.totalHours || passage.duration || 0}h</span>
            </div>
            
            {passage.waterConsumption && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Droplets className="h-4 w-4" />
                <span>{passage.waterConsumption}L</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};