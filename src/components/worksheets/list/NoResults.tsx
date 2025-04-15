
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NoResultsProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreateNew: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ hasFilters, onClearFilters, onCreateNew }) => {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-semibold mb-1">Aucune fiche trouvée</h3>
      
      {hasFilters ? (
        <>
          <p className="text-muted-foreground mb-4">
            Aucune fiche ne correspond à vos critères de recherche.
          </p>
          <Button variant="outline" onClick={onClearFilters}>
            Effacer les filtres
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">
            Aucune fiche vierge ne correspond à votre recherche.
          </p>
          <Button onClick={onCreateNew}>
            Créer une nouvelle fiche vierge
          </Button>
        </>
      )}
    </div>
  );
};

export default NoResults;
