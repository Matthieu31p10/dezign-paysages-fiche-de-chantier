
import { useMemo } from 'react';
import { getDay } from 'date-fns';
import { ProjectInfo } from '@/types/models';

interface ScheduledEvent {
  projectId: string;
  projectName: string;
  team: string;
  date: string;
  passageNumber: number;
  totalPassages: number;
  address: string;
  visitDuration: number;
  isLocked?: boolean;
}

export const useScheduledEvents = (
  filteredProjects: ProjectInfo[],
  getYearlyPassageSchedule: (year: number) => Record<string, Record<string, number>>,
  selectedYear: number,
  isProjectLockedOnDay: (projectId: string, dayOfWeek: number) => boolean
) => {
  return useMemo(() => {
    try {
      const events: ScheduledEvent[] = [];
      const yearlySchedule = getYearlyPassageSchedule(selectedYear);

      console.log('Generating scheduled events with lock checking...');

      filteredProjects.forEach(project => {
        const projectSchedule = yearlySchedule[project.id];
        if (projectSchedule) {
          Object.entries(projectSchedule).forEach(([date, passageNumber]) => {
            const dayOfWeek = getDay(new Date(date)) === 0 ? 7 : getDay(new Date(date));
            const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
            
            if (!isLocked) {
              events.push({
                projectId: project.id,
                projectName: project.name,
                team: project.team,
                date,
                passageNumber,
                totalPassages: project.annualVisits || 12,
                address: project.address,
                visitDuration: project.visitDuration,
                isLocked: false
              });
            } else {
              console.log(`Skipping locked event for ${project.name} on ${date} (day ${dayOfWeek})`);
            }
          });
        }
      });

      return events.sort((a, b) => a.date.localeCompare(b.date));
    } catch (err) {
      console.error('Error generating scheduled events:', err);
      throw err;
    }
  }, [filteredProjects, getYearlyPassageSchedule, selectedYear, isProjectLockedOnDay]);
};
