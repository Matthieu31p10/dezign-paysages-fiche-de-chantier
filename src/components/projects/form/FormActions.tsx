
import React from 'react';
import CancelButton from '@/components/worksheets/form/actions/CancelButton';
import { Button } from '@/components/ui/button';
import FormActionsContainer from '@/components/worksheets/form/actions/FormActionsContainer';

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isEditing,
  onCancel,
}) => {
  return (
    <FormActionsContainer>
      <div className="flex-grow"></div>
      <div className="flex justify-end space-x-2">
        <CancelButton onClick={onCancel} />
        <Button type="submit">
          {isEditing ? 'Mettre à jour' : 'Créer le chantier'}
        </Button>
      </div>
    </FormActionsContainer>
  );
};

export default FormActions;
