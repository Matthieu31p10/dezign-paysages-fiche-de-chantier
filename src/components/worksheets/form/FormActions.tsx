
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Save, X } from 'lucide-react';
import FormActionsContainer from './actions/FormActionsContainer';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
  handleCancel?: () => void;
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
  
  // Utiliser handleCancel s'il est fourni, sinon utiliser onCancel
  const handleCancelClick = handleCancel || onCancel;
  
  // Différence de style visuel entre les fiches vierges et les fiches de suivi
  const buttonColor = isBlankWorksheet 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-green-600 hover:bg-green-700 text-white';
  
  const buttonText = isEditing 
    ? `Mettre à jour la fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'}` 
    : `Créer la fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'}`;
  
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
        className={`min-w-32 ${buttonColor} px-6`}
      >
        {isSubmitting ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {isEditing ? "Mise à jour..." : "Création..."}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
    </FormActionsContainer>
  );
};

export default FormActions;
