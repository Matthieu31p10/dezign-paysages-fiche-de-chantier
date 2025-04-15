
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  projectId?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, projectId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8 space-y-4">
      <FileX className="h-12 w-12 mx-auto text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
      <Button onClick={() => navigate(projectId ? `/worklogs/new?projectId=${projectId}` : '/worklogs/new')}>
        Créer une fiche de suivi
      </Button>
    </div>
  );
};

export default EmptyState;
