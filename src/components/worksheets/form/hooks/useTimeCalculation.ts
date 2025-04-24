
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';

export const useTimeCalculation = (form: UseFormReturn<BlankWorkSheetValues>) => {
  const { watch, setValue } = form;
  
  // Use useWatch for better performance instead of watch
  const departure = useWatch({
    control: form.control,
    name: 'departure',
  });
  
  const arrival = useWatch({
    control: form.control,
    name: 'arrival',
  });
  
  const end = useWatch({
    control: form.control,
    name: 'end',
  });
  
  const breakTime = useWatch({
    control: form.control,
    name: 'breakTime',
  });
  
  const personnel = useWatch({
    control: form.control,
    name: 'personnel',
  });

  // Calculate total hours
  useEffect(() => {
    if (departure && arrival && end) {
      try {
        // Parse times
        const [departureHours, departureMinutes] = departure.split(':').map(Number);
        const [arrivalHours, arrivalMinutes] = arrival.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);
        
        // Convert to minutes
        const departureInMinutes = departureHours * 60 + departureMinutes;
        const arrivalInMinutes = arrivalHours * 60 + arrivalMinutes;
        const endInMinutes = endHours * 60 + endMinutes;
        
        // Calculate break time
        let breakTimeMinutes = 0;
        if (breakTime) {
          const [breakHours, breakMinutes] = breakTime.split(':').map(Number);
          breakTimeMinutes = breakHours * 60 + breakMinutes;
        }
        
        // Calculate total time
        let totalMinutes = (endInMinutes - arrivalInMinutes) + (arrivalInMinutes - departureInMinutes) - breakTimeMinutes;
        
        // Handle overnight shifts
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60;
        }
        
        // Convert back to hours
        const totalHours = totalMinutes / 60;
        
        // Update total hours field
        setValue('totalHours', Math.round(totalHours * 100) / 100);
      } catch (error) {
        console.error('Error calculating hours:', error);
      }
    }
  }, [departure, arrival, end, breakTime, setValue]);
  
  // Calculate team hours when personnel or totalHours change
  useEffect(() => {
    const totalHours = watch('totalHours');
    const personnelCount = personnel?.length || 1;
    
    // Calculate total team hours
    const totalTeamHours = totalHours * personnelCount;
    
    // Could be used if needed in the form
    // setValue('totalTeamHours', totalTeamHours);
  }, [watch, setValue, personnel]);
};
