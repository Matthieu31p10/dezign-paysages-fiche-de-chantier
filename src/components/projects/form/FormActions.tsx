
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isEditing,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline"
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button type="submit">
        {isEditing ? 'Mettre à jour' : 'Créer le chantier'}
      </Button>
    </div>
  );
};

export default FormActions;
