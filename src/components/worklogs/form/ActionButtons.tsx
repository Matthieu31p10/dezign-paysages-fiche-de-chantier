
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWorkLogForm } from './WorkLogFormContext';
import { Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, isEditing }) => {
  const { form } = useWorkLogForm();
  const { formState } = form;
  const isSubmitting = formState.isSubmitting;
  
  return (
    <div className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="min-w-32"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting 
          ? (isEditing ? "Mise à jour..." : "Création...") 
          : (isEditing ? "Mettre à jour la fiche" : "Créer la fiche")
        }
      </Button>
    </div>
  );
};

export default ActionButtons;
