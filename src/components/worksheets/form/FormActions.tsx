
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
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel
}) => {
  const isMobile = useIsMobile();
  
  return (
    <FormActionsContainer>
      <SubmitButton isSubmitting={isSubmitting} />
      <CancelButton onCancel={onCancel} />
    </FormActionsContainer>
  );
};

export default FormActions;
