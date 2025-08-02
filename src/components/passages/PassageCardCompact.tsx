import React from 'react';
import { Badge } from '@/components/ui/badge';
import { safeFormatDate, safeDateDifference } from '@/utils/dateUtils';
import { WorkLog } from '@/types/models';
import { Clock, MapPin, Users, CheckCircle, AlertTriangle } from 'lucide-react';

interface PassageCardCompactProps {
  passage: WorkLog;
  getProjectName: (projectId: string) => string;
}

export const PassageCardCompact: React.FC<PassageCardCompactProps> = ({ passage, getProjectName }) => {
  const today = new Date();
  const daysAgo = safeDateDifference(today, passage.date) ?? 0;

  const formatPassageDate = (dateString: string) => {
    return safeFormatDate(dateString, 'd/MM/yyyy', 'Date invalide');
  };

  const getPassageStatus = (days: number) => {
    if (days === 0) return {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100/50 dark:bg-green-900/20',
      icon: CheckCircle
    };
    if (days <= 7) return {
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100/50 dark:bg-blue-900/20',
      icon: Clock
    };
    if (days <= 30) return {
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100/50 dark:bg-orange-900/20',
      icon: Clock
    };
    return {
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100/50 dark:bg-red-900/20',
      icon: AlertTriangle
    };
  };

  const status = getPassageStatus(daysAgo);
  const StatusIcon = status.icon;

  return (
    <div className={`border border-border rounded-lg p-3 bg-background hover:bg-muted/30 transition-all duration-200 hover:shadow-sm ${status.bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground text-sm truncate">{getProjectName(passage.projectId)}</h4>
            <Badge variant="outline" className="text-xs">
              #{passage.projectId.slice(-4)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatPassageDate(passage.date)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>{passage.timeTracking?.totalHours || passage.duration || 0}h</span>
            </div>
            
            {passage.personnel && passage.personnel.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="truncate">{passage.personnel[0]}{passage.personnel.length > 1 ? ` +${passage.personnel.length - 1}` : ''}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`text-xs px-2 py-1 ${status.bgColor} ${status.color} border-0`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {daysAgo === 0 ? "Auj." : `${daysAgo}j`}
          </Badge>
        </div>
      </div>
    </div>
  );
};