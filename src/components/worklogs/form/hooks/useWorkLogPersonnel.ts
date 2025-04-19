
import { useState, useCallback } from 'react';
import { Personnel } from '@/types/models';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';
import { useApp } from '@/context/AppContext';

interface UseWorkLogPersonnelProps {
  form: UseFormReturn<FormValues>;
  initialSelectedPersonnel?: string[];
}

export const useWorkLogPersonnel = ({
  form,
  initialSelectedPersonnel = []
}: UseWorkLogPersonnelProps) => {
  const { settings } = useApp();
  const availablePersonnel = settings.personnel || [];
  
  // Get the current selected personnel from the form
  const selectedPersonnel = form.watch('personnel') || [];
  
  // Calculate active personnel
  const activePersonnel = availablePersonnel.filter(p => p.active);
  
  // Handle selection changes
  const handlePersonnelChange = useCallback((personnel: string[]) => {
    form.setValue('personnel', personnel, { shouldValidate: true });
  }, [form]);
  
  return {
    selectedPersonnel,
    activePersonnel,
    handlePersonnelChange
  };
};
