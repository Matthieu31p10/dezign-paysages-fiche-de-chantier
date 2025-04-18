
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';

interface WorkLogFormSubmitHandlerProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const WorkLogFormSubmitHandler: React.FC<WorkLogFormSubmitHandlerProps> = ({ 
  children, 
  onSuccess 
}) => {
  const methods = useFormContext<BlankWorkSheetValues>();
  
  const handleFormSubmit = async (formData: BlankWorkSheetValues) => {
    try {
      console.log('Form submitted:', formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
