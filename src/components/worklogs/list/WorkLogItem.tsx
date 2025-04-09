
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, User, Clock, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface WorkLogItemProps {
  workLog: WorkLog;
  index: number;
  projectId?: string;
}

const WorkLogItem = ({ workLog, index, projectId }: WorkLogItemProps) => {
  const navigate = useNavigate();
  const { deleteWorkLog, getProjectById } = useApp();
  
  // Generate worklog code format (DZFS + 5 digits)
  const generateWorkLogCode = (index: number) => {
    return `DZFS${String(index + 1).padStart(5, '0')}`;
  };
  
  const handleDeleteWorkLog = (id: string) => {
    deleteWorkLog(id);
  };
  
  const project = getProjectById(workLog.projectId);
  const worklogCode = generateWorkLogCode(index);
  
  // Format the creation time from the createdAt date - Fixed: Convert Date to string for formatTime
  const registrationTime = workLog.createdAt 
    ? formatTime(workLog.createdAt.toString()) 
    : '';
  
  return (
    <div
      key={workLog.id}
      className="border rounded-lg p-4 bg-white hover:shadow transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700 font-mono">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              {worklogCode}
            </Badge>
            {registrationTime && (
              <span className="text-xs text-muted-foreground">
                Enregistré à {registrationTime}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700">
              {formatDate(workLog.date)}
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
              {workLog.timeTracking.totalHours.toFixed(2)} heures
            </div>
            
            <div className="flex items-center text-sm">
              <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              {workLog.personnel.length} personnes
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/worklogs/${workLog.id}`)}
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
                <AlertDialogAction onClick={() => handleDeleteWorkLog(workLog.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default WorkLogItem;
