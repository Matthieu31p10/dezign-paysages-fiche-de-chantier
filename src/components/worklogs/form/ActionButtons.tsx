
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
  const isFormValid = formState.isValid;
  
  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return isEditing ? "Mise à jour..." : "Création...";
    }
    return isEditing ? "Mettre à jour la fiche" : "Créer la fiche";
  };

  return (
    <div className="flex justify-between">
      <CancelButton onCancel={onCancel} disabled={isSubmitting} />
      <SubmitButton 
        isSubmitting={isSubmitting} 
        isDisabled={isSubmitting || !isFormValid}
        buttonText={getSubmitButtonText()}
      />
    </div>
  );
};

interface CancelButtonProps {
  onCancel: () => void;
  disabled: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onCancel, disabled }) => (
  <Button 
    type="button" 
    variant="outline" 
    onClick={onCancel}
    disabled={disabled}
  >
    Annuler
  </Button>
);

interface SubmitButtonProps {
  isSubmitting: boolean;
  isDisabled: boolean;
  buttonText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting, 
  isDisabled,
  buttonText
}) => (
  <Button 
    type="submit"
    disabled={isDisabled}
  >
    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {buttonText}
  </Button>
);

export default ActionButtons;
