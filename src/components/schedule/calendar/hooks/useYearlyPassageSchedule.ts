
import { useMemo } from 'react';
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, getDay, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import { ProjectInfo } from '@/types/models';

export const useYearlyPassageSchedule = (
  teamProjects: ProjectInfo[], 
  year: number, 
  showWeekends: boolean,
  isProjectLockedOnDay?: (projectId: string, dayOfWeek: number) => boolean,
  getProjectLockDetails?: (projectId: string, dayOfWeek: number) => { minDaysBetweenVisits?: number } | null,
  monthlyRules?: Record<string, Record<string, number>>
) => {
  return useMemo(() => {
    return (currentYear: number) => {
      const yearStart = startOfYear(new Date(currentYear, 0));
      const yearEnd = endOfYear(new Date(currentYear, 0));
      const yearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      const yearlySchedule: Record<string, Record<string, number>> = {};
      
      
      
      teamProjects.forEach(project => {
        const annualVisits = project.annualVisits || 12;
        
        yearlySchedule[project.id] = {};
        
        // Get monthly distribution for this project
        const projectMonthlyRule = monthlyRules?.[project.id];
        
        // Si pas de règle mensuelle définie, utiliser une répartition uniforme
        const monthlyDistribution: Record<number, number> = {};
        if (projectMonthlyRule) {
          for (let month = 0; month < 12; month++) {
            monthlyDistribution[month] = projectMonthlyRule[month.toString()] || 0;
          }
        } else {
          // Répartition uniforme par défaut
          const baseVisitsPerMonth = Math.floor(annualVisits / 12);
          const extraVisits = annualVisits % 12;
          
          for (let month = 0; month < 12; month++) {
            monthlyDistribution[month] = baseVisitsPerMonth + (month < extraVisits ? 1 : 0);
          }
        }
        
        
        
        const scheduledDates: Date[] = [];
        let totalScheduled = 0;
        
        // Programmer mois par mois selon la distribution
        for (let month = 0; month < 12 && totalScheduled < annualVisits; month++) {
          const visitsThisMonth = monthlyDistribution[month];
          if (visitsThisMonth === 0) continue;
          
          const monthStart = startOfMonth(new Date(currentYear, month));
          const monthEnd = endOfMonth(new Date(currentYear, month));
          const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
          
          // TOUJOURS filtrer les weekends pour la programmation des passages
          let availableDays = monthDays.filter(d => !isWeekend(d));
          
          // Appliquer les verrouillages avec priorité absolue
          if (isProjectLockedOnDay && getProjectLockDetails) {
            const lockedDays = availableDays.filter(day => {
              const dayOfWeek = getDay(day) === 0 ? 7 : getDay(day);
              const isLocked = isProjectLockedOnDay(project.id, dayOfWeek);
              
              if (isLocked) {
                const lockDetails = getProjectLockDetails(project.id, dayOfWeek);
                const minDays = lockDetails?.minDaysBetweenVisits;
                
                // Si pas de délai minimum (ou 0), bloquer complètement ce jour
                if (!minDays || minDays === 0) {
                  return false; // Exclure ce jour
                }
                // Sinon, garder le jour mais on gérera l'espacement plus tard
              }
              return true;
            });
            
            availableDays = lockedDays;
          }
          
          
          
          if (availableDays.length === 0) {
            
            continue;
          }
          
          // Programmer les visites pour ce mois en respectant les délais minimum
          let monthScheduled = 0;
          const monthInterval = Math.floor(availableDays.length / Math.max(visitsThisMonth, 1));
          
          for (let visit = 0; visit < visitsThisMonth && monthScheduled < visitsThisMonth && totalScheduled < annualVisits; visit++) {
            let dayIndex = visit * monthInterval;
            
            // Ajouter une variation pour éviter la régularité parfaite
            if (monthInterval > 3) {
              dayIndex += Math.floor(monthInterval / 3);
            }
            
            // Chercher un jour valide en respectant les délais minimum
            let attempts = 0;
            let scheduled = false;
            
            while (attempts < availableDays.length && !scheduled) {
              const candidateIndex = (dayIndex + attempts) % availableDays.length;
              const candidateDay = availableDays[candidateIndex];
              const dayOfWeek = getDay(candidateDay) === 0 ? 7 : getDay(candidateDay);
              
              let canSchedule = true;
              
              // Vérifier les délais minimum pour les jours verrouillés
              if (isProjectLockedOnDay && getProjectLockDetails && isProjectLockedOnDay(project.id, dayOfWeek)) {
                const lockDetails = getProjectLockDetails(project.id, dayOfWeek);
                const minDays = lockDetails?.minDaysBetweenVisits;
                
                if (minDays && minDays > 0) {
                  // Vérifier le respect du délai minimum par rapport aux autres passages
                  const tooClose = scheduledDates.some(scheduledDate => {
                    const daysDiff = Math.abs(differenceInDays(candidateDay, scheduledDate));
                    return daysDiff < minDays;
                  });
                  
                  if (tooClose) {
                    canSchedule = false;
                    
                  }
                }
              }
              
              // Vérifier aussi un espacement minimum général (même pour les jours non verrouillés)
              if (canSchedule && scheduledDates.length > 0) {
                const minGeneralSpacing = 7; // 7 jours minimum entre passages
                const tooCloseGeneral = scheduledDates.some(scheduledDate => {
                  const daysDiff = Math.abs(differenceInDays(candidateDay, scheduledDate));
                  return daysDiff < minGeneralSpacing;
                });
                
                if (tooCloseGeneral) {
                  canSchedule = false;
                }
              }
              
              if (canSchedule) {
                scheduledDates.push(candidateDay);
                const dateKey = format(candidateDay, 'yyyy-MM-dd');
                yearlySchedule[project.id][dateKey] = totalScheduled + 1;
                
                
                
                monthScheduled++;
                totalScheduled++;
                scheduled = true;
              }
              
              attempts++;
            }
            
            if (!scheduled) {
              
            }
          }
        }
        
        
      });
      
      return yearlySchedule;
    };
  }, [teamProjects, showWeekends, isProjectLockedOnDay, getProjectLockDetails, monthlyRules]);
};
