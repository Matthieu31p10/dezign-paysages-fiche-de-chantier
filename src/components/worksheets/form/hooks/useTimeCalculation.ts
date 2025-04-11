
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { calculateTotalHours as calculateHours } from '@/utils/time';

interface UseTimeCalculationProps {
  form: UseFormReturn<BlankWorkSheetValues>;
}

/**
 * Hook to handle time calculation effects
 */
export const useTimeCalculation = ({ form }: UseTimeCalculationProps) => {
  // Auto-calculate total hours when time fields change
  useEffect(() => {
    const departureTime = form.watch("departure");
    const arrivalTime = form.watch("arrival");
    const endTime = form.watch("end");
    const breakTimeValue = form.watch("breakTime");
    const selectedPersonnel = form.watch("personnel");
    
    if (departureTime && arrivalTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      try {
        const calculatedTotalHours = calculateHours(
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
  
  return {
    // Return empty object as we're only using the side effect
  };
};
