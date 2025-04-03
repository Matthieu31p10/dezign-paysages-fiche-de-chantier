
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  message: string;
  projectId?: string;
}

const EmptyState = ({ message, projectId }: EmptyStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={() => navigate(projectId ? `/worklogs/new?projectId=${projectId}` : '/worklogs/new')}>
        Créer une fiche de suivi
      </Button>
    </div>
  );
};

export default EmptyState;
