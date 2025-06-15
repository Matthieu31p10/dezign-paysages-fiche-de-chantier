
import { useState, useCallback } from 'react';
import { Personnel } from '@/types/models';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';
import { useSettings } from '@/context/SettingsContext';

interface UseWorkLogPersonnelProps {
  form: UseFormReturn<FormValues>;
  initialSelectedPersonnel?: string[];
}

export const useWorkLogPersonnel = ({
  form,
  initialSelectedPersonnel = []
}: UseWorkLogPersonnelProps) => {
  const { getPersonnel } = useSettings();
  const availablePersonnel = getPersonnel();
  
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
