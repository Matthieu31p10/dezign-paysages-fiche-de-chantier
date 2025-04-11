
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';

export const useTimeCalculation = (form: UseFormReturn<BlankWorkSheetValues>) => {
  // Watch for changes in time-related fields
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only calculate when time-related fields change
      if (
        name === 'departure' ||
        name === 'arrival' ||
        name === 'end' ||
        name === 'breakTime'
      ) {
        calculateTotalHours(value);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Calculate total hours function
  const calculateTotalHours = (values: any) => {
    const { departure, arrival, end, breakTime } = values;

    // Make sure we have all the required values
    if (!departure || !arrival || !end) {
      form.setValue('totalHours', 0);
      return;
    }

    try {
      // Parse the time strings into Date objects
      const departureTime = parseTimeString(departure);
      const arrivalTime = parseTimeString(arrival);
      const endTime = parseTimeString(end);
      const breakDuration = parseFloat(breakTime || '0');

      // Calculate total minutes spent on site
      let totalMinutes = 0;

      // Calculate travel time to site
      const travelToSiteMinutes = getMinutesDifference(departureTime, arrivalTime);

      // Calculate time spent on site (end - arrival - break)
      const onSiteMinutes = getMinutesDifference(arrivalTime, endTime) - (breakDuration * 60);

      // Total time is travel + on-site time
      totalMinutes = onSiteMinutes;

      // Convert to hours with 2 decimal precision
      const totalHours = Math.max(0, parseFloat((totalMinutes / 60).toFixed(2)));
      
      // Update the form
      form.setValue('totalHours', totalHours);

    } catch (error) {
      console.error('Error calculating time:', error);
      form.setValue('totalHours', 0);
    }
  };

  return {
    calculateTotalHours
  };
};

// Helper function to parse time strings (HH:MM format)
const parseTimeString = (timeStr: string): Date => {
  if (!timeStr || !timeStr.includes(':')) {
    throw new Error('Invalid time format');
  }

  const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Helper function to get minutes difference between two Date objects
const getMinutesDifference = (start: Date, end: Date): number => {
  // If end is before start (e.g., overnight work), add 24 hours
  let diff = end.getTime() - start.getTime();
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }
  return diff / (1000 * 60);
};
