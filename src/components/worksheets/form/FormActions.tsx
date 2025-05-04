
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Save, X } from 'lucide-react';
import FormActionsContainer from './actions/FormActionsContainer';
import SubmitButton from './actions/SubmitButton';
import CancelButton from './actions/CancelButton';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
  handleCancel?: () => void; // Add this prop to match what's being passed
  isBlankWorksheet?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel,
  isEditing = false,
  handleCancel,
  isBlankWorksheet = false
}) => {
  const isMobile = useIsMobile();
  
  // Use handleCancel if provided, otherwise use onCancel
  const handleCancelClick = handleCancel || onCancel;
  
  const buttonColor = isBlankWorksheet 
    ? 'bg-blue-600 hover:bg-blue-700' 
    : 'bg-green-600 hover:bg-green-700';
  
  return (
    <FormActionsContainer>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancelClick}
        disabled={isSubmitting}
        className="flex items-center px-6 border-gray-300 hover:bg-gray-100 hover:text-gray-800"
      >
        <X className="w-4 h-4 mr-2" />
        Annuler
      </Button>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
        className={`min-w-32 ${buttonColor} text-white px-6`}
      >
        {isSubmitting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {isEditing ? "Mise à jour..." : "Création..."}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Mettre à jour" : `Créer la fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'}`}
          </>
        )}
      </Button>
    </FormActionsContainer>
  );
};

export default FormActions;
