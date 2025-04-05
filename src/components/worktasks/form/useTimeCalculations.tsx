
import { UseFormReturn } from 'react-hook-form';

export const useTimeCalculations = () => {
  /**
   * Converts a time string in the format "HH:MM" to minutes
   * @param timeStr Time string in format "HH:MM"
   * @returns Total minutes or 0 if invalid
   */
  const convertTimeToMinutes = (timeStr: string): number => {
    // Check if timeStr is valid
    if (!timeStr || timeStr === '') return 0;
    
    // Validate format using regex (HH:MM)
    const isValidFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
    if (!isValidFormat) {
      console.warn(`Invalid time format: ${timeStr}. Expected format: HH:MM`);
      return 0;
    }
    
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours * 60) + minutes;
    } catch (error) {
      console.error(`Error parsing time: ${timeStr}`, error);
      return 0;
    }
  };

  /**
   * Converts minutes to a time string in the format "HH:MM"
   * @param minutes Total minutes
   * @returns Time string in format "HH:MM"
   */
  const minutesToTimeString = (minutes: number): string => {
    if (isNaN(minutes) || minutes < 0) return '00:00';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  /**
   * Calculates time values from the form and updates related fields
   * @param form React Hook Form instance
   */
  const calculateTimeValues = (form: UseFormReturn<any>) => {
    const timeTracking = form.getValues('timeTracking');
    if (!timeTracking) return;
    
    // Early return if required fields are missing
    if (!timeTracking.departure || !timeTracking.arrival || !timeTracking.end) {
      return;
    }
    
    try {
      const departureTime = convertTimeToMinutes(timeTracking.departure);
      const arrivalTime = convertTimeToMinutes(timeTracking.arrival);
      const endTime = convertTimeToMinutes(timeTracking.end);
      const breakTimeMinutes = convertTimeToMinutes(timeTracking.breakTime || '00:00');
      
      // Validate that all required times were successfully parsed
      if (departureTime === 0 && timeTracking.departure !== '00:00') return;
      if (arrivalTime === 0 && timeTracking.arrival !== '00:00') return;
      if (endTime === 0 && timeTracking.end !== '00:00') return;

      let travelMinutes = arrivalTime - departureTime;
      // Handle crossing midnight during travel
      if (travelMinutes < 0) {
        travelMinutes += 24 * 60; // Add 24 hours in minutes
      }
      
      let workMinutes = endTime - arrivalTime - breakTimeMinutes;
      // Handle crossing midnight during work
      if (workMinutes < 0) {
        workMinutes += 24 * 60; // Add 24 hours in minutes
      }
      
      // Convert to hours with 2 decimal precision
      const travelHours = Math.round(travelMinutes / 60 * 100) / 100;
      const workHours = Math.round(workMinutes / 60 * 100) / 100;
      const totalHours = Math.round((travelHours + workHours) * 100) / 100;
      
      // Prevent negative values
      form.setValue('timeTracking.travelHours', Math.max(0, travelHours));
      form.setValue('timeTracking.workHours', Math.max(0, workHours));
      form.setValue('timeTracking.totalHours', Math.max(0, totalHours));
    } catch (error) {
      console.error("Error calculating time values:", error);
    }
  };

  return {
    calculateTimeValues,
    convertTimeToMinutes,
    minutesToTimeString
  };
};
