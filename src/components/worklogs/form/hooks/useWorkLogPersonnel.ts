
import { useState, useCallback } from 'react';
import { Personnel } from '@/types/models';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';

interface UseWorkLogPersonnelProps {
  form: UseFormReturn<FormValues>;
  availablePersonnel: Personnel[];
  initialSelectedPersonnel?: string[];
}

export const useWorkLogPersonnel = ({
  form,
  availablePersonnel,
  initialSelectedPersonnel = []
}: UseWorkLogPersonnelProps) => {
  const [personnelDialogOpen, setPersonnelDialogOpen] = useState<boolean>(false);
  
  // Get the current selected personnel from the form
  const selectedPersonnel = form.watch('personnel') || [];
  
  // Calculate active personnel
  const activePersonnel = availablePersonnel.filter(p => p.active);
  
  // Handle selection changes
  const handlePersonnelChange = useCallback((personnel: string[]) => {
    form.setValue('personnel', personnel, { shouldValidate: true });
    setPersonnelDialogOpen(false);
  }, [form]);
  
  // Handle opening the dialog
  const openPersonnelDialog = useCallback(() => {
    setPersonnelDialogOpen(true);
  }, []);
  
  // Handle closing the dialog
  const closePersonnelDialog = useCallback(() => {
    setPersonnelDialogOpen(false);
  }, []);
  
  return {
    selectedPersonnel,
    personnelDialogOpen,
    activePersonnel,
    openPersonnelDialog,
    closePersonnelDialog,
    handlePersonnelChange
  };
};
