
import { useMemo } from 'react';

interface ScheduledEvent {
  id: string;
  projectId: string;
  projectName: string;
  teams: string[];
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
}

interface UseModernSidebarDataProps {
  selectedMonth: number;
  selectedYear: number;
  filteredProjects: any[];
  scheduledEvents: ScheduledEvent[];
}

export const useModernSidebarData = ({
  selectedMonth,
  selectedYear,
  filteredProjects,
  scheduledEvents
}: UseModernSidebarDataProps) => {
  // Memoized calculations for better performance
  const monthStats = useMemo(() => {
    const monthEvents = scheduledEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedMonth - 1 && eventDate.getFullYear() === selectedYear;
    });

    const totalHours = monthEvents.reduce((sum, event) => sum + event.visitDuration, 0);
    const totalProjects = new Set(monthEvents.map(event => event.projectId)).size;
    const avgHoursPerProject = totalProjects > 0 ? Math.round((totalHours / totalProjects) * 10) / 10 : 0;

    return {
      totalEvents: monthEvents.length,
      totalHours,
      totalProjects,
      avgHoursPerProject,
      monthEvents
    };
  }, [scheduledEvents, selectedMonth, selectedYear]);

  // Memoized project stats
  const projectStats = useMemo(() => {
    return filteredProjects.slice(0, 8).map(project => {
      const projectEvents = monthStats.monthEvents.filter(e => e.projectId === project.id);
      const projectHours = projectEvents.reduce((sum, e) => sum + e.visitDuration, 0);
      
      return {
        ...project,
        eventsCount: projectEvents.length,
        totalHours: projectHours,
        nextVisit: projectEvents.find(e => new Date(e.date) >= new Date())
      };
    });
  }, [filteredProjects, monthStats.monthEvents]);

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('fr-FR', { month: 'long' });

  return {
    monthStats,
    projectStats,
    monthName
  };
};
