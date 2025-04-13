
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, FileIcon } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <Card>
      <CardContent className="py-10">
        <div className="text-center">
          <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune fiche vierge</h3>
          <p className="text-muted-foreground mb-6">
            Vous n'avez encore créé aucune fiche vierge.
          </p>
          <Button onClick={onCreateNew}>
            <FilePlus className="w-4 h-4 mr-2" />
            Créer une fiche vierge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
