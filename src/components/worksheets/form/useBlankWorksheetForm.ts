
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blankWorkSheetSchema, BlankWorkSheetValues } from '../schema';
import { useState, useEffect } from 'react';
import { calculateTotalHours } from '@/utils/time';
import { useApp } from '@/context/AppContext';
import { useProjectLink } from './useProjectLinkHook';
import { submitWorksheetForm } from './submitWorksheetForm';
import { toast } from 'sonner';

export const useBlankWorksheetForm = (
  onSuccess?: () => void, 
  initialValues?: Partial<BlankWorkSheetValues>,
  workLogId?: string
) => {
  const { addWorkLog, updateWorkLog } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with default values or initialValues if provided
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(blankWorkSheetSchema),
    defaultValues: {
      clientName: initialValues?.clientName || '',
      address: initialValues?.address || '',
      contactPhone: initialValues?.contactPhone || '',
      contactEmail: initialValues?.contactEmail || '',
      date: initialValues?.date || new Date(),
      workDescription: initialValues?.workDescription || '',
      personnel: initialValues?.personnel || [],
      departure: initialValues?.departure || '08:00',
      arrival: initialValues?.arrival || '08:30',
      end: initialValues?.end || '16:30',
      breakTime: initialValues?.breakTime || '00:30',
      totalHours: initialValues?.totalHours || 7.5,
      hourlyRate: initialValues?.hourlyRate || 0,
      wasteManagement: initialValues?.wasteManagement || 'none',
      teamFilter: initialValues?.teamFilter || 'all',
      linkedProjectId: initialValues?.linkedProjectId || '',
      notes: initialValues?.notes || '',
      consumables: initialValues?.consumables || [],
      vatRate: initialValues?.vatRate || "20",
      signedQuote: initialValues?.signedQuote || false,
    }
  });
  
  // Project link functionality with initial value if editing
  const projectLinkHook = useProjectLink(form, initialValues?.linkedProjectId);
  
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
    try {
      setIsSubmitting(true);
      await submitWorksheetForm({
        data,
        addWorkLog,
        updateWorkLog,
        workLogId,
        onSuccess,
        setIsSubmitting
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Une erreur est survenue lors de la soumission du formulaire');
      setIsSubmitting(false);
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    form.reset({
      clientName: '',
      address: '',
      contactPhone: '',
      contactEmail: '',
      date: new Date(),
      workDescription: '',
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
      notes: '',
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
