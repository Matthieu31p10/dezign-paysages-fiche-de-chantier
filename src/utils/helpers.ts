
import { WorkLog } from "@/types/models";

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatTime(time: string): string {
  if (!time) return '00:00';
  
  // If time is already in format HH:MM, return it
  if (/^\d{1,2}:\d{2}$/.test(time)) return time;
  
  // Convert decimal hours to HH:MM
  const hours = Math.floor(parseFloat(time));
  const minutes = Math.round((parseFloat(time) - hours) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function timeStringToHours(time: string): number {
  if (!time) return 0;
  
  // If time is in format HH:MM
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }
  
  // If time is already a decimal number
  return parseFloat(time) || 0;
}

export function calculateTotalHours(
  departureTime: string,
  arrivalTime: string,
  breakTime: string,
  personnelCount: number
): number {
  // Convert strings to hours (decimal)
  const departure = timeStringToHours(departureTime);
  const arrival = timeStringToHours(arrivalTime);
  const breakHours = timeStringToHours(breakTime);
  
  // Calculate hours between departure and arrival, minus break
  const hoursWorked = Math.max(0, arrival - departure - breakHours);
  
  // Multiply by number of personnel
  return hoursWorked * personnelCount;
}

export function calculateAnnualProgress(workLogs: WorkLog[], expectedVisits: number): number {
  const completedVisits = workLogs.length;
  return Math.min(100, Math.round((completedVisits / expectedVisits) * 100));
}

// Format a number to 2 decimal places
export function formatNumber(value: number): string {
  return value.toFixed(2).replace(/\.00$/, '');
}

// Group work logs by month
export function groupWorkLogsByMonth(workLogs: WorkLog[]): Record<string, WorkLog[]> {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(log);
  });
  
  return grouped;
}

// Get month name from month number
export function getMonthName(month: number): string {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  return monthNames[month - 1];
}

// Format month-year string to readable format
export function formatMonthYear(monthYear: string): string {
  const [month, year] = monthYear.split('-').map(Number);
  return `${getMonthName(month)} ${year}`;
}

// Get current year
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// Get years from work logs for filtering
export function getYearsFromWorkLogs(workLogs: WorkLog[]): number[] {
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    years.add(date.getFullYear());
  });
  
  return Array.from(years).sort((a, b) => b - a);
}

// Filter work logs by year
export function filterWorkLogsByYear(workLogs: WorkLog[], year: number): WorkLog[] {
  return workLogs.filter(log => {
    const date = new Date(log.date);
    return date.getFullYear() === year;
  });
}
