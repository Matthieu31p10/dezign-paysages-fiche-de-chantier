
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { useEffect } from 'react';
import { calculateTotalHours } from '@/utils/time';

export const useTimeTracking = (onTimeChange?: () => void) => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const totalHours = watch('totalHours');
  const personnel = watch('personnel') || [];
  const personnelCount = personnel.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  
  // Auto-calculate hours when inputs change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'departure' || name === 'arrival' || name === 'end' || name === 'breakTime' || name === 'personnel') {
        const departure = value.departure || '';
        const arrival = value.arrival || '';
        const end = value.end || '';
        const breakTime = value.breakTime || '';
        const personnelCount = (value.personnel || []).length || 1;
        
        if (departure && arrival && end) {
          try {
            const calculatedHours = calculateTotalHours(departure, arrival, end, breakTime, 1);
            setValue('totalHours', calculatedHours);
          } catch (error) {
            console.error('Error calculating hours:', error);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return {
    control,
    totalHours,
    personnelCount,
    totalTeamHours
  };
};
