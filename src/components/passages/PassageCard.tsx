import React from 'react';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog } from '@/types/models';

interface PassageCardProps {
  passage: WorkLog;
  getProjectName: (projectId: string) => string;
}

export const PassageCard: React.FC<PassageCardProps> = ({ passage, getProjectName }) => {
  const today = new Date();
  const passageDate = new Date(passage.date);
  const daysAgo = differenceInDays(today, passageDate);

  const formatPassageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getDaysBadgeVariant = (days: number) => {
    if (days === 0) return 'default';
    if (days <= 7) return 'secondary';
    if (days <= 30) return 'outline';
    return 'destructive';
  };

  const getPassageCardStyle = (days: number) => {
    if (days === 0) return 'border-l-4 border-l-passage-success bg-passage-success/5';
    if (days <= 7) return 'border-l-4 border-l-passage-recent bg-passage-recent/5';
    if (days <= 30) return 'border-l-4 border-l-passage-warning bg-passage-warning/5';
    return 'border-l-4 border-l-destructive bg-destructive/5';
  };

  return (
    <div className={`border border-border rounded-lg p-4 bg-background hover:bg-muted/50 transition-all duration-300 hover:shadow-md ${getPassageCardStyle(daysAgo)}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{getProjectName(passage.projectId)}</h3>
            <Badge variant="outline" className="text-xs border-primary text-primary">
              {getProjectName(passage.projectId)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatPassageDate(passage.date)}
          </p>
          {passage.personnel && passage.personnel.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Équipe: {passage.personnel.join(', ')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={getDaysBadgeVariant(daysAgo)}
            className={
              daysAgo === 0 ? 'bg-green-600 text-white' :
              daysAgo <= 7 ? 'bg-blue-600 text-white' :
              daysAgo <= 30 ? 'bg-orange-600 text-white' :
              'bg-red-600 text-white'
            }
          >
            {daysAgo === 0 ? "Aujourd'hui" : 
             daysAgo === 1 ? "Hier" : 
             `Il y a ${daysAgo} jours`}
          </Badge>
          <div className="text-sm text-foreground font-medium">
            {passage.timeTracking?.totalHours || passage.duration || 0}h
          </div>
        </div>
      </div>
    </div>
  );
};