
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  handleCancel: () => void;
  isEditing?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  handleCancel,
  isEditing = false
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Mise à jour...' : 'Création...'}
          </>
        ) : (
          isEditing ? 'Mettre à jour' : 'Créer la fiche'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
