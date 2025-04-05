
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  entityName: string;
  newPath: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ entityName, newPath }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">Aucune {entityName}</h2>
      <p className="text-muted-foreground mb-6">
        Vous n'avez pas encore créé de {entityName}. Commencez par créer votre première fiche.
      </p>
      <Button onClick={() => navigate(newPath)}>
        <Plus className="w-4 h-4 mr-2" />
        Nouvelle fiche
      </Button>
    </div>
  );
};

export default EmptyState;
