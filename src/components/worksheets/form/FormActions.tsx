
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  handleCancel: () => void;
  isEditing?: boolean;
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  handleCancel,
  isEditing = false,
  onSubmit
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="min-w-32"
        onClick={onSubmit}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting 
          ? (isEditing ? "Modification..." : "Création...") 
          : (isEditing ? "Modifier la fiche" : "Créer la fiche")
        }
      </Button>
    </div>
  );
};

export default FormActions;
