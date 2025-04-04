
import React from 'react';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ProjectDeleteDialogProps {
  onDeleteConfirm: () => void;
}

const ProjectDeleteDialog: React.FC<ProjectDeleteDialogProps> = ({ onDeleteConfirm }) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action est irréversible. Elle supprimera définitivement la fiche chantier
          ainsi que toutes les fiches de suivi associées.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>
        <AlertDialogAction onClick={onDeleteConfirm}>
          Supprimer
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default ProjectDeleteDialog;
