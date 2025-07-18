
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWorkLogForm } from './WorkLogFormContext';
import { Loader2, Save, X } from 'lucide-react';

interface ActionButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
  isBlankWorksheet?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, isEditing, isBlankWorksheet = false }) => {
  const { form } = useWorkLogForm();
  const { formState } = form;
  const isSubmitting = formState.isSubmitting;
  
  return (
    <div className="flex justify-between gap-4 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex items-center px-6 border-gray-300 hover:bg-gray-100 hover:text-gray-800"
      >
        <X className="w-4 h-4 mr-2" />
        Annuler
      </Button>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
        className={`min-w-32 ${isBlankWorksheet ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-primary-foreground px-6`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Mise à jour..." : "Création..."}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Mettre à jour la fiche" : `Créer la fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'}`}
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
