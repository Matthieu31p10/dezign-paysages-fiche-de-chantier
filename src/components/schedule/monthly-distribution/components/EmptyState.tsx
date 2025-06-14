
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  selectedTeam: string;
  onGenerateDefault: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ selectedTeam, onGenerateDefault }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {selectedTeam === 'all' 
        ? "Aucune règle définie. Utilisez le bouton pour générer la distribution par défaut."
        : "Aucun chantier trouvé pour cette équipe."
      }
      {selectedTeam === 'all' && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={onGenerateDefault}
        >
          Générer distribution par défaut
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
