
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectForm from '../ProjectForm';
import { ProjectInfo } from '@/types/models';

interface ProjectEditDialogProps {
  project: ProjectInfo;
  onSuccess: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({ project, onSuccess }) => {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Modifier la fiche chantier</DialogTitle>
        <DialogDescription>
          Modifiez les informations de la fiche chantier.
        </DialogDescription>
      </DialogHeader>
      <ProjectForm initialData={project} onSuccess={onSuccess} />
    </DialogContent>
  );
};

export default ProjectEditDialog;
