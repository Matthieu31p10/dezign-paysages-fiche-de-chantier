
import React from 'react';
import { Filter } from 'lucide-react';

interface NoResultsStateProps {
  entityName: string;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({ entityName }) => {
  return (
    <div className="text-center py-12">
      <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">Aucun résultat</h2>
      <p className="text-muted-foreground">
        Aucune {entityName} ne correspond aux critères de recherche.
      </p>
    </div>
  );
};

export default NoResultsState;
