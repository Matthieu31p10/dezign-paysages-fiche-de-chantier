
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash, Calendar } from 'lucide-react';
import { ProjectInfo } from '@/types/models';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface ProjectDetailHeaderProps {
  project: ProjectInfo;
  teamName: string;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  onDeleteClick: () => void;
  isEditDialogOpen: boolean;
  isMobile?: boolean;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  project,
  teamName,
  setIsEditDialogOpen,
  onDeleteClick,
  isEditDialogOpen,
  isMobile = false
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={`flex flex-col ${isMobile ? 'space-y-3' : 'md:flex-row md:items-center'} justify-between gap-4`}>
      <div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <Badge variant="outline" className="bg-brand-50 text-brand-700 hover:bg-brand-100">
            {teamName}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold mt-2">{project.name}</h1>
        <p className="text-muted-foreground flex items-center mt-1">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {project.address}
        </p>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2`}>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </DialogTrigger>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </AlertDialogTrigger>
        </AlertDialog>
        
        <Button size="sm" className={isMobile ? "w-full mt-2" : ""} onClick={() => navigate(`/worklogs/new?projectId=${project.id}`)}>
          <Calendar className="w-4 h-4 mr-2" />
          Nouvelle fiche de suivi
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
