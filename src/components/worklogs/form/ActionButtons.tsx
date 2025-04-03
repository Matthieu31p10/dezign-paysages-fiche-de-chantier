
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, isEditing }) => {
  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit">
        {isEditing ? "Mettre à jour la fiche" : "Créer la fiche"}
      </Button>
    </div>
  );
};

export default ActionButtons;
