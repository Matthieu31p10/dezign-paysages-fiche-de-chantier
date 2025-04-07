
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blankWorkSheetSchema, BlankWorkSheetValues } from '../schema';
import { useState, useEffect } from 'react';
import { calculateTotalHours } from '@/utils/time';
import { useApp } from '@/context/AppContext';
import { useProjectLink } from './useProjectLinkHook';
import { submitWorksheetForm } from './submitWorksheetForm';

export const useBlankWorksheetForm = (onSuccess?: () => void) => {
  const { addWorkLog } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(blankWorkSheetSchema),
    defaultValues: {
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      workDescription: '',
      consumables: [],
      vatRate: "20",
      signedQuote: false,
    }
  });
  
  // Project link functionality
  const projectLinkHook = useProjectLink(form);
  
  // Update total hours when time values change
  useEffect(() => {
    const departureTime = form.watch("departure");
    const arrivalTime = form.watch("arrival");
    const endTime = form.watch("end");
    const breakTimeValue = form.watch("breakTime");
    const selectedPersonnel = form.watch("personnel");
    
    if (departureTime && arrivalTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      try {
        const calculatedTotalHours = calculateTotalHours(
          departureTime,
          arrivalTime,
          endTime,
          breakTimeValue,
          selectedPersonnel.length
        );
        
        form.setValue('totalHours', Number(calculatedTotalHours));
      } catch (error) {
        console.error("Error calculating total hours:", error);
      }
    }
  }, [
    form.watch("departure"), 
    form.watch("arrival"), 
    form.watch("end"), 
    form.watch("breakTime"), 
    form.watch("personnel").length, 
    form
  ]);
  
  // Handle form submission
  const handleSubmit = async (data: BlankWorkSheetValues) => {
    await submitWorksheetForm({
      data,
      addWorkLog,
      onSuccess,
      setIsSubmitting
    });
  };
  
  // Reset form to initial state
  const resetForm = () => {
    form.reset({
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      workDescription: '',
      consumables: [],
      vatRate: "20",
      signedQuote: false,
    });
    
    projectLinkHook.handleClearProject();
  };
  
  // Helper functions for form interactions
  const handleTeamFilterChange = (value: string) => {
    form.setValue('teamFilter', value);
  };
  
  const handlePersonnelChange = (selectedPersonnel: string[]) => {
    form.setValue('personnel', selectedPersonnel);
  };
  
  const handleCancel = () => {
    if (onSuccess) onSuccess();
  };
  
  return {
    form,
    isSubmitting,
    ...projectLinkHook,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleTeamFilterChange,
    handlePersonnelChange,
    handleCancel,
    resetForm
  };
};
