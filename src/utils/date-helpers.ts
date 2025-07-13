// Date utility functions

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth();
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[monthIndex] || '';
};

export const getLastNMonths = (n: number): Array<{ year: number; month: number; name: string }> => {
  const months = [];
  const now = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      name: getMonthName(date.getMonth())
    });
  }
  
  return months;
};

export const getDaysBetweenDates = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDaysSinceLastEntry = (lastDate: Date | string | null): number => {
  if (!lastDate) return 0;
  
  const last = typeof lastDate === 'string' ? new Date(lastDate) : lastDate;
  const now = new Date();
  
  return getDaysBetweenDates(last, now);
};

export const calculateAverageHoursPerVisit = (totalHours: number, visitCount: number): number => {
  if (visitCount === 0) return 0;
  return totalHours / visitCount;
};

export const filterWorkLogsByYear = (workLogs: any[], year: number): any[] => {
  return workLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === year;
  });
};

export const groupWorkLogsByMonth = (workLogs: any[]): Record<string, any[]> => {
  return workLogs.reduce((groups, log) => {
    const date = new Date(log.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(log);
    return groups;
  }, {});
};

export const getYearsFromWorkLogs = (workLogs: any[]): number[] => {
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    const year = new Date(log.date).getFullYear();
    years.add(year);
  });
  
  return Array.from(years).sort((a, b) => b - a);
};

export const parseTimeString = (timeString: string): number => {
  if (!timeString) return 0;
  
  // Parse formats like "08:30", "8:30", "8h30", "8.5"
  const cleanTime = timeString.trim().toLowerCase();
  
  // Handle decimal format (8.5)
  if (cleanTime.includes('.') && !cleanTime.includes(':')) {
    return parseFloat(cleanTime) || 0;
  }
  
  // Handle colon format (08:30) or h format (8h30)
  const parts = cleanTime.split(/[h:]/).map(part => part.replace(/[^\d]/g, ''));
  
  if (parts.length >= 2) {
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    return hours + (minutes / 60);
  }
  
  // Handle single number (assume hours)
  return parseFloat(parts[0]) || 0;
};

export const calculateHoursBetween = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  
  const start = parseTimeString(startTime);
  const end = parseTimeString(endTime);
  
  if (end <= start) {
    // Handle case where end time is next day
    return (24 - start) + end;
  }
  
  return end - start;
};

export const getLastVisitDate = (workLogs: any[]): Date | null => {
  if (!workLogs || workLogs.length === 0) return null;
  
  const sortedLogs = workLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return new Date(sortedLogs[0].date);
};

export const getDaysSinceLastVisit = (workLogs: any[]): number => {
  const lastVisitDate = getLastVisitDate(workLogs);
  if (!lastVisitDate) return Number.MAX_SAFE_INTEGER; // Return very large number if no visits
  
  return getDaysSinceLastEntry(lastVisitDate);
};