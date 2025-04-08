
import { WorkLog } from '@/types/models';
import { ensureDate } from './date-utils';

export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => new Date(log.date).getFullYear() === year);
};

export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  const years = new Set<number>();
  workLogs.forEach(log => {
    years.add(new Date(log.date).getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
};

export const groupWorkLogsByMonth = (workLogs: WorkLog[]): Record<string, WorkLog[]> => {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!grouped[month]) {
      grouped[month] = [];
    }
    
    grouped[month].push(log);
  });
  
  return grouped;
};

export const calculateAverageHoursPerVisit = (workLogs: WorkLog[]): number => {
  if (workLogs.length === 0) return 0;
  
  const totalHours = workLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
  return totalHours / workLogs.length;
};

export const calculateTotalHours = (
  departureTime: string,
  arrivalTime: string,
  endTime: string,
  breakTimeValue: string,
  personnelCount: number
): number => {
  const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
  const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const [breakHours, breakMinutes] = breakTimeValue.split(':').map(Number);

  const departureInMinutes = departureHours * 60 + departureMinutes;
  const arrivalInMinutes = arrivalHours * 60 + arrivalMinutes;
  const endInMinutes = endHours * 60 + endMinutes;
  const breakInMinutes = breakHours * 60 + breakMinutes;

  const totalWorkTime = endInMinutes - departureInMinutes - breakInMinutes;
  const travelTime = arrivalInMinutes - departureInMinutes;
  const effectiveWorkTime = totalWorkTime - travelTime;

  if (effectiveWorkTime < 0) {
    throw new Error("Total work time cannot be negative.");
  }

  return (effectiveWorkTime / 60) * personnelCount;
};
