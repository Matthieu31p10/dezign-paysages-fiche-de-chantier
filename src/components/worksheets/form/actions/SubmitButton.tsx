
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isEditing?: boolean;
  onClick?: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  isEditing = false,
  onClick
}) => {
  return (
    <Button 
      type="submit"
      disabled={isSubmitting}
      className="min-w-32"
      onClick={onClick}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting 
        ? (isEditing ? "Modification..." : "Création...") 
        : (isEditing ? "Modifier la fiche" : "Créer la fiche")
      }
    </Button>
  );
};

export default SubmitButton;
