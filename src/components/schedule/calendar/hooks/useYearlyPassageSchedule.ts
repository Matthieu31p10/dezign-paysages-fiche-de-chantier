
import { useMemo } from 'react';
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, getDay, differenceInDays } from 'date-fns';
import { ProjectInfo } from '@/types/models';

export const useYearlyPassageSchedule = (
  teamProjects: ProjectInfo[], 
  year: number, 
  showWeekends: boolean,
  isProjectLockedOnDay?: (projectId: string, dayOfWeek: number) => boolean,
  getProjectLockDetails?: (projectId: string, dayOfWeek: number) => { minDaysBetweenVisits?: number } | null
) => {
  return useMemo(() => {
    return (currentYear: number) => {
      const yearStart = startOfYear(new Date(currentYear, 0));
      const yearEnd = endOfYear(new Date(currentYear, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const yearlySchedule: Record<string, Record<string, number>> = {};
      
      console.log('Generating yearly schedule with lock checking and minimum delays...');
      
      teamProjects.forEach(project => {
        const annualVisits = project.annualVisits || 12;
        
        yearlySchedule[project.id] = {};
        
        // Filter out locked days if lock function is provided
        let availableDays = showWeekends ? yearDays : yearDays.filter(d => !isWeekend(d));
        
        if (isProjectLockedOnDay && getProjectLockDetails) {
          availableDays = availableDays.filter(day => {
            const dayOfWeek = getDay(day) === 0 ? 7 : getDay(day);
            const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
            
            if (isLocked) {
              const lockDetails = getProjectLockDetails(project.id, dayOfWeek);
              const minDays = lockDetails?.minDaysBetweenVisits;
              
              // Si pas de délai minimum défini (ou 0), bloquer complètement
              if (!minDays || minDays === 0) {
                console.log(`Filtering out ${format(day, 'yyyy-MM-dd')} for project ${project.name} - day ${dayOfWeek} is completely locked`);
                return false;
              }
              
              // Sinon, on garde le jour dans les jours disponibles mais on gérera l'espacement plus tard
              return true;
            }
            return true;
          });
        }
        
        console.log(`Project ${project.name}: ${availableDays.length} available days for ${annualVisits} annual visits`);
        
        if (availableDays.length === 0) {
          console.warn(`No available days for project ${project.name} - all days are locked!`);
          return;
        }
        
        // Générer les passages en tenant compte des délais minimum
        const scheduledDates: Date[] = [];
        const interval = Math.floor(availableDays.length / annualVisits);
        
        for (let i = 0; i < annualVisits && scheduledDates.length < annualVisits; i++) {
          let dayIndex = i * interval;
          dayIndex += Math.floor(interval / 3);
          
          // Chercher un jour valide en tenant compte des délais minimum
          let attempts = 0;
          while (attempts < availableDays.length && scheduledDates.length < annualVisits) {
            const candidateIndex = (dayIndex + attempts) % availableDays.length;
            const candidateDay = availableDays[candidateIndex];
            const dayOfWeek = getDay(candidateDay) === 0 ? 7 : getDay(candidateDay);
            
            // Vérifier s'il y a un délai minimum pour ce jour
            let canSchedule = true;
            if (isProjectLockedOnDay && getProjectLockDetails && isProjectLockedOnDay(project.id, dayOfWeek)) {
              const lockDetails = getProjectLockDetails(project.id, dayOfWeek);
              const minDays = lockDetails?.minDaysBetweenVisits;
              
              if (minDays && minDays > 0) {
                // Vérifier si le délai minimum est respecté par rapport aux autres passages déjà programmés
                const tooClose = scheduledDates.some(scheduledDate => {
                  const daysDiff = Math.abs(differenceInDays(candidateDay, scheduledDate));
                  return daysDiff < minDays;
                });
                
                if (tooClose) {
                  canSchedule = false;
                  console.log(`Cannot schedule ${format(candidateDay, 'yyyy-MM-dd')} for project ${project.name} - too close to another visit (min ${minDays} days required)`);
                }
              }
            }
            
            if (canSchedule) {
              scheduledDates.push(candidateDay);
              const dateKey = format(candidateDay, 'yyyy-MM-dd');
              yearlySchedule[project.id][dateKey] = scheduledDates.length;
              console.log(`Scheduled visit ${scheduledDates.length} for ${project.name} on ${dateKey}`);
              break;
            }
            
            attempts++;
          }
          
          // Si on n'a pas pu programmer ce passage, passer au suivant
          if (attempts >= availableDays.length) {
            console.warn(`Could not schedule visit ${i + 1} for project ${project.name} due to minimum delay constraints`);
          }
        }
      });
      
      return yearlySchedule;
    };
  }, [teamProjects, showWeekends, isProjectLockedOnDay, getProjectLockDetails]);
};
