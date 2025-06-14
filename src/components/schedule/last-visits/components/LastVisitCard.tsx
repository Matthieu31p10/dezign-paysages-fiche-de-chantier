
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LastVisitInfo } from '../types';

interface LastVisitCardProps {
  visitInfo: LastVisitInfo;
}

const LastVisitCard: React.FC<LastVisitCardProps> = ({ visitInfo }) => {
  const { projectName, lastVisitDate, daysSinceLastVisit, address } = visitInfo;

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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Dernier passage : {format(lastVisitDate, "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
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
