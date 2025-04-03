
import { WorkLog } from '@/types/models';

// Sort logs based on the selected option
export const sortWorkLogs = (logs: WorkLog[], sortOption: string, getProjectById: (id: string) => any) => {
  return [...logs].sort((a, b) => {
    switch(sortOption) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'project-asc':
        const projectA = getProjectById(a.projectId)?.name || '';
        const projectB = getProjectById(b.projectId)?.name || '';
        return projectA.localeCompare(projectB);
      case 'project-desc':
        const projectNameA = getProjectById(a.projectId)?.name || '';
        const projectNameB = getProjectById(b.projectId)?.name || '';
        return projectNameB.localeCompare(projectNameA);
      case 'hours-asc':
        return a.timeTracking.totalHours - b.timeTracking.totalHours;
      case 'hours-desc':
        return b.timeTracking.totalHours - a.timeTracking.totalHours;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
};

// Sort months in the correct order based on the sort option
export const sortMonths = (months: string[], sortOption: string) => {
  return months.sort((a, b) => {
    const [monthA, yearA] = a.split('-').map(Number);
    const [monthB, yearB] = b.split('-').map(Number);
    
    if (sortOption.includes('asc')) {
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    } else {
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    }
  });
};
