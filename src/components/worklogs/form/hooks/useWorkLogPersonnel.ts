
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';

interface UseWorkLogPersonnelProps {
  form: UseFormReturn<FormValues>;
}

export const useWorkLogPersonnel = ({ form }: UseWorkLogPersonnelProps) => {
  const handlePersonnelChange = (personnel: string[]) => {
    form.setValue('personnel', personnel);
  };

  return {
    handlePersonnelChange,
    selectedPersonnel: form.watch('personnel') || []
  };
};
