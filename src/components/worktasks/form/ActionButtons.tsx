
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isEditing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isEditing }) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="submit" className="min-w-[150px]">
        {isEditing ? 'Mettre à jour' : 'Enregistrer'}
      </Button>
    </div>
  );
};

export default ActionButtons;
