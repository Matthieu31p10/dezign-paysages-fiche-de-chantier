import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PassageTableProps {
  passages: WorkLog[];
  getProjectName: (projectId: string) => string;
}

export const PassageTable: React.FC<PassageTableProps> = ({
  passages,
  getProjectName
}) => {
  const getDaysSincePassage = (date: string) => {
    const passageDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - passageDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysColor = (days: number) => {
    if (days === 0) return 'bg-green-100 text-green-800 border-green-200';
    if (days <= 7) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (days <= 30) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-32">Date</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead className="w-24">Équipe</TableHead>
            <TableHead className="w-24">Durée</TableHead>
            <TableHead className="w-32">Jours écoulés</TableHead>
            <TableHead>Remarques</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {passages.map((passage) => {
            const daysSince = getDaysSincePassage(passage.date);
            
            return (
              <TableRow key={passage.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm">
                        {format(new Date(passage.date), 'dd MMM', { locale: fr })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(passage.date), 'yyyy', { locale: fr })}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {getProjectName(passage.projectId)}
                    </div>
                    {passage.address && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {passage.address}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  {passage.personnel && passage.personnel.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{passage.personnel[0]}</span>
                      {passage.personnel.length > 1 && (
                        <span className="text-xs text-muted-foreground">+{passage.personnel.length - 1}</span>
                      )}
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  {(passage.timeTracking?.totalHours || passage.duration) && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">
                        {passage.timeTracking?.totalHours || passage.duration}h
                      </span>
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getDaysColor(daysSince)}`}
                  >
                    {daysSince === 0 ? "Aujourd'hui" : `${daysSince}j`}
                  </Badge>
                </TableCell>
                
                <TableCell className="max-w-xs">
                  {passage.notes && (
                    <div className="text-xs text-muted-foreground truncate">
                      {passage.notes}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};