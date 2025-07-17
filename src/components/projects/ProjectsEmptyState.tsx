import { Button } from '@/components/ui/button';
import { Plus, FileText, Archive } from 'lucide-react';

interface ProjectsEmptyStateProps {
  type: 'active' | 'archived';
  hasProjects: boolean;
  onCreateProject: () => void;
}

const ProjectsEmptyState = ({ type, hasProjects, onCreateProject }: ProjectsEmptyStateProps) => {
  if (type === 'active') {
    return (
      <div className="text-center py-12">
        {!hasProjects ? (
          <div className="max-w-md mx-auto">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Aucun chantier</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore créé de fiche chantier. Commencez par créer votre premier chantier.
            </p>
            <Button onClick={onCreateProject}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau chantier
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-medium mb-2">Aucun résultat</h2>
            <p className="text-muted-foreground">
              Aucun chantier ne correspond à votre recherche.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      {!hasProjects ? (
        <div>
          <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Aucun chantier archivé</h2>
          <p className="text-muted-foreground">
            Les chantiers sont automatiquement archivés lorsqu'une date de fin est spécifiée.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-medium mb-2">Aucun résultat</h2>
          <p className="text-muted-foreground">
            Aucun chantier archivé ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsEmptyState;