
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
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel,
  isEditing = false,
  handleCancel
}) => {
  const isMobile = useIsMobile();
  
  // Use handleCancel if provided, otherwise use onCancel
  const handleCancelClick = handleCancel || onCancel;
  
  return (
    <FormActionsContainer>
      <SubmitButton isSubmitting={isSubmitting} isEditing={isEditing} />
      <CancelButton onClick={handleCancelClick} />
    </FormActionsContainer>
  );
};

export default FormActions;
