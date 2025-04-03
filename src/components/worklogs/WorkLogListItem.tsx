
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Clock, User, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDate } from '@/utils/helpers';

interface WorkLogItemProps {
  log: WorkLog;
  index: number;
  projectId?: string;
  onDelete: (id: string) => void;
  getProjectById: (id: string) => any;
}

export const WorkLogListItem = ({ log, index, projectId, onDelete, getProjectById }: WorkLogItemProps) => {
  const navigate = useNavigate();
  const project = getProjectById(log.projectId);
  
  // Generate worklog code format (DZFS + 5 digits)
  const worklogCode = `DZFS${String(index + 1).padStart(5, '0')}`;
  
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700 font-mono">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              {worklogCode}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700">
              {formatDate(log.date)}
            </Badge>
            {!projectId && project && (
              <Badge variant="secondary">
                {project.name}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center text-sm">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              {log.timeTracking.totalHours.toFixed(2)} heures
            </div>
            
            <div className="flex items-center text-sm">
              <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              {log.personnel.length} personnes
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/worklogs/${log.id}`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Elle supprimera définitivement la fiche de suivi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(log.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1.5">
        {log.tasksPerformed.mowing && (
          <Badge variant="outline" className="bg-slate-50">
            Tonte
          </Badge>
        )}
        {log.tasksPerformed.brushcutting && (
          <Badge variant="outline" className="bg-slate-50">
            Débroussaillage
          </Badge>
        )}
        {log.tasksPerformed.blower && (
          <Badge variant="outline" className="bg-slate-50">
            Souffleur
          </Badge>
        )}
        {log.tasksPerformed.manualWeeding && (
          <Badge variant="outline" className="bg-slate-50">
            Désherbage manuel
          </Badge>
        )}
        {log.tasksPerformed.whiteVinegar && (
          <Badge variant="outline" className="bg-slate-50">
            Vinaigre blanc
          </Badge>
        )}
        {log.tasksPerformed.pruning.done && (
          <Badge variant="outline" className="bg-slate-50">
            Taille {log.tasksPerformed.pruning.progress}%
          </Badge>
        )}
        {log.tasksPerformed.watering !== 'none' && (
          <Badge variant="outline" className="bg-slate-50">
            Arrosage {log.tasksPerformed.watering === 'on' ? 'allumé' : 'coupé'}
          </Badge>
        )}
      </div>
    </div>
  );
};
