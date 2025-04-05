
import { UseFormReturn } from 'react-hook-form';

export const useTimeCalculations = () => {
  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr === '') return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateTimeValues = (form: UseFormReturn<any>) => {
    const timeTracking = form.getValues('timeTracking');
    if (timeTracking.departure && timeTracking.arrival && timeTracking.end) {
      const departureTime = convertTimeToMinutes(timeTracking.departure);
      const arrivalTime = convertTimeToMinutes(timeTracking.arrival);
      const endTime = convertTimeToMinutes(timeTracking.end);
      const breakTimeMinutes = convertTimeToMinutes(timeTracking.breakTime || '00:00');

      const travelHours = (arrivalTime - departureTime) / 60;
      
      const workHours = (endTime - arrivalTime - breakTimeMinutes) / 60;
      
      const totalHours = travelHours + workHours;
      
      form.setValue('timeTracking.travelHours', Math.round(travelHours * 100) / 100);
      form.setValue('timeTracking.workHours', Math.round(workHours * 100) / 100);
      form.setValue('timeTracking.totalHours', Math.round(totalHours * 100) / 100);
    }
  };

  return {
    calculateTimeValues,
    convertTimeToMinutes
  };
};
