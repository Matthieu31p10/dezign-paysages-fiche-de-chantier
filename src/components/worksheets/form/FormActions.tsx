
import React from 'react';
import CancelButton from './actions/CancelButton';
import SubmitButton from './actions/SubmitButton';
import FormActionsContainer from './actions/FormActionsContainer';

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
    <FormActionsContainer>
      <CancelButton 
        onClick={handleCancel} 
        disabled={isSubmitting} 
      />
      
      <SubmitButton 
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        onClick={onSubmit}
      />
    </FormActionsContainer>
  );
};

export default FormActions;
