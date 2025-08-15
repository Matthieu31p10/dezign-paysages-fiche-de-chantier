import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clock,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { WorkLog } from '@/types/models';
import { formatNumber } from '@/utils/helpers';

interface ActivityFeedProps {
  recentActivity: WorkLog[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ recentActivity }) => {
  const getActivityIcon = (log: WorkLog) => {
    const hours = log.timeTracking?.totalHours || 0;
    if (hours >= 8) return CheckCircle;
    if (hours >= 4) return Clock;
    return AlertCircle;
  };

  const getActivityColor = (log: WorkLog) => {
    const hours = log.timeTracking?.totalHours || 0;
    if (hours >= 8) return 'text-green-600';
    if (hours >= 4) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getActivityBadgeVariant = (log: WorkLog): "default" | "secondary" | "destructive" | "outline" => {
    const hours = log.timeTracking?.totalHours || 0;
    if (hours >= 8) return 'default';
    if (hours >= 4) return 'secondary';
    return 'outline';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>
          Dernières interventions enregistrées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((log, index) => {
              const IconComponent = getActivityIcon(log);
              const iconColor = getActivityColor(log);
              const badgeVariant = getActivityBadgeVariant(log);
              const hours = log.timeTracking?.totalHours || 0;
              const personnel = log.personnel?.length || 0;
              
              return (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={`${iconColor} bg-background`}>
                      <IconComponent className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Intervention #{index + 1}
                      </p>
                      <Badge variant={badgeVariant} className="text-xs">
                        {formatNumber(hours)}h
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {personnel > 0 && `${personnel} personne${personnel > 1 ? 's' : ''} • `}
                      {formatRelativeTime(log.date)}
                    </p>
                    
                    {log.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune activité récente
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;