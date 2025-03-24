
import { WorkLog, ProjectInfo } from '@/types/models';

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

// Format numbers for display
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
};

// Convert time string to hours
export const timeStringToHours = (timeString: string): number => {
  if (!timeString) return 0;
  
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + (minutes / 60);
};

// Group work logs by month
export const groupWorkLogsByMonth = (workLogs: WorkLog[]): Record<string, WorkLog[]> => {
  const grouped: Record<string, WorkLog[]> = {};
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${month}-${year}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(log);
  });
  
  return grouped;
};

// Format month and year
export const formatMonthYear = (monthYear: string): string => {
  const [month, year] = monthYear.split('-').map(Number);
  
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};

// Get years from work logs
export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  if (!workLogs.length) return [getCurrentYear()];
  
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    years.add(date.getFullYear());
  });
  
  // Add current year if not in the set
  years.add(getCurrentYear());
  
  return Array.from(years).sort((a, b) => b - a); // Sort in descending order
};

// Filter work logs by year
export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => {
    const date = new Date(log.date);
    return date.getFullYear() === year;
  });
};

// Get project type color class
export const getProjectTypeColorClass = (type: string): string => {
  switch (type) {
    case 'residence':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'particular':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'enterprise':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Get project badge color based on type
export const getProjectTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'residence':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'particular':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'enterprise':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Get project type label
export const getProjectTypeLabel = (type: string): string => {
  switch (type) {
    case 'residence':
      return 'Résidence';
    case 'particular':
      return 'Particulier';
    case 'enterprise':
      return 'Entreprise';
    default:
      return 'Non défini';
  }
};

// Get active projects
export const getActiveProjects = (projects: ProjectInfo[]): ProjectInfo[] => {
  return projects.filter(project => !project.isArchived);
};

// Check if a project should be archived based on end date
export const shouldArchiveProject = (project: ProjectInfo): boolean => {
  if (!project.endDate) return false;
  
  const endDate = new Date(project.endDate);
  const today = new Date();
  
  return endDate < today;
};
