
import React from 'react';
import { Link } from 'react-router-dom';
import { WorkTask } from '@/types/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, FileText, ArrowRight } from 'lucide-react';

interface WorkTaskItemProps {
  workTask: WorkTask;
}

export const WorkTaskItem: React.FC<WorkTaskItemProps> = ({ workTask }) => {
  return (
    <Link to={`/worktasks/${workTask.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 inline text-primary" />
                {workTask.title}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 inline" />
                  {workTask.location || 'Aucune adresse'}
                </div>
                
                <div className="flex flex-wrap gap-x-4 mt-1 text-xs">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    {format(new Date(workTask.date), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {workTask.duration} {workTask.duration > 1 ? 'heures' : 'heure'}
                  </div>
                </div>
              </div>
            </div>
            
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
