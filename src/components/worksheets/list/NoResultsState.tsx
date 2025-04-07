
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface NoResultsStateProps {
  onClearFilters: () => void;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({ onClearFilters }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="py-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Search className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Aucun résultat</h3>
          <p className="text-muted-foreground">
            Aucune fiche vierge ne correspond à votre recherche
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={onClearFilters}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoResultsState;
