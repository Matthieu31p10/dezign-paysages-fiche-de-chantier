
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WorkLogListEmptyProps {
  projectId?: string;
}

export const WorkLogListEmpty = ({ projectId }: WorkLogListEmptyProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">Aucune fiche de suivi disponible</p>
      <Button onClick={() => navigate(projectId ? `/worklogs/new?projectId=${projectId}` : '/worklogs/new')}>
        Créer une fiche de suivi
      </Button>
    </div>
  );
};
