
import { WorkLog } from '@/types/models';

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const formatDate = (date: Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (time: string): string => {
  if (!time) return '';
  return time;
};

export const calculateTotalHours = (
  departure: string,
  arrival: string,
  end: string,
  breakTime: string
): number => {
  if (!departure || !arrival || !end || !breakTime) return 0;

  try {
    // Convert times to minutes since midnight
    const getMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Calculate minutes for each component
    const departureMinutes = getMinutes(departure);
    const arrivalMinutes = getMinutes(arrival);
    const endMinutes = getMinutes(end);
    const breakMinutes = getMinutes(breakTime);

    // Calculate total time accounting for arrival, departure, and break
    let travelTimeMinutes = arrivalMinutes - departureMinutes;
    let workTimeMinutes = endMinutes - arrivalMinutes;
    let totalTimeMinutes = travelTimeMinutes + workTimeMinutes - breakMinutes;

    // Handle cases where times span midnight
    if (arrivalMinutes < departureMinutes) {
      travelTimeMinutes = (24 * 60 - departureMinutes) + arrivalMinutes;
    }
    if (endMinutes < arrivalMinutes) {
      workTimeMinutes = (24 * 60 - arrivalMinutes) + endMinutes;
    }

    totalTimeMinutes = travelTimeMinutes + workTimeMinutes - breakMinutes;

    // Convert minutes to hours and round to 2 decimal places
    return Math.round((totalTimeMinutes / 60) * 100) / 100;
  } catch (error) {
    console.error('Error calculating total hours:', error);
    return 0;
  }
};

// Days since last entry
export const getDaysSinceLastEntry = (workLogs: WorkLog[]): number | null => {
  if (!workLogs.length) return null;
  
  // Get dates from all work logs
  const dates = workLogs.map(log => new Date(log.date));
  
  // Find most recent date
  const mostRecent = new Date(Math.max(...dates.map(date => date.getTime())));
  
  // Calculate days since that date
  const today = new Date();
  const timeDiff = today.getTime() - mostRecent.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  return dayDiff;
};

// Calculate average hours per visit
export const calculateAverageHoursPerVisit = (workLogs: WorkLog[]): number => {
  if (workLogs.length === 0) return 0;
  
  const totalHours = workLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
  return Math.round((totalHours / workLogs.length) * 100) / 100;
};

