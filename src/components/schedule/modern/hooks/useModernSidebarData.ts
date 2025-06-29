
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
  // Memoized month events filtering for better performance
  const monthEvents = useMemo(() => {
    return scheduledEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedMonth - 1 && eventDate.getFullYear() === selectedYear;
    });
  }, [scheduledEvents, selectedMonth, selectedYear]);

  // Memoized month statistics calculation
  const monthStats = useMemo(() => {
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
  }, [monthEvents]);

  // Memoized project statistics with optimized calculations
  const projectStats = useMemo(() => {
    // Create a lookup map for faster project event filtering
    const projectEventsMap = monthEvents.reduce((acc, event) => {
      if (!acc[event.projectId]) {
        acc[event.projectId] = [];
      }
      acc[event.projectId].push(event);
      return acc;
    }, {} as Record<string, ScheduledEvent[]>);

    return filteredProjects.slice(0, 8).map(project => {
      const projectEvents = projectEventsMap[project.id] || [];
      const projectHours = projectEvents.reduce((sum, e) => sum + e.visitDuration, 0);
      
      return {
        ...project,
        eventsCount: projectEvents.length,
        totalHours: projectHours,
        nextVisit: projectEvents.find(e => new Date(e.date) >= new Date())
      };
    });
  }, [filteredProjects, monthEvents]);

  // Memoized month name calculation
  const monthName = useMemo(() => {
    return new Date(selectedYear, selectedMonth - 1).toLocaleString('fr-FR', { month: 'long' });
  }, [selectedMonth, selectedYear]);

  return {
    monthStats,
    projectStats,
    monthName
  };
};
