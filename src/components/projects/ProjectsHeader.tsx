import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import ProjectForm from './ProjectForm';

interface ProjectsHeaderProps {
  isFormDialogOpen: boolean;
  onFormDialogChange: (open: boolean) => void;
  onFormSuccess: () => void;
}

const ProjectsHeader = ({ isFormDialogOpen, onFormDialogChange, onFormSuccess }: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Fiches chantier</h1>
        <p className="text-muted-foreground">
          Gérez vos fiches d'informations chantier
        </p>
      </div>
      
      <Dialog open={isFormDialogOpen} onOpenChange={onFormDialogChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau chantier
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle fiche chantier</DialogTitle>
          </DialogHeader>
          <ProjectForm onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsHeader;