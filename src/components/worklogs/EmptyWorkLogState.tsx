
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarX, Plus } from 'lucide-react';

interface EmptyWorkLogStateProps {
  hasProjects: boolean;
}

export const EmptyWorkLogState = ({ hasProjects }: EmptyWorkLogStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">Aucune fiche de suivi</h2>
      <p className="text-muted-foreground mb-6">
        Vous n'avez pas encore créé de fiche de suivi. Commencez par créer votre première fiche.
      </p>
      
      {hasProjects ? (
        <Button onClick={() => navigate('/worklogs/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche
        </Button>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Vous devez d'abord créer un chantier avant de pouvoir créer une fiche de suivi.
          </p>
          <Button onClick={() => navigate('/projects/new')}>
            Créer un chantier
          </Button>
        </div>
      )}
    </div>
  );
};
