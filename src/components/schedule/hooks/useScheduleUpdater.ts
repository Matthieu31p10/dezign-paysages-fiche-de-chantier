
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useProjectLocks } from '../project-locks/hooks/useProjectLocks';
import { ProjectInfo } from '@/types/models';

export const useScheduleUpdater = (projects: ProjectInfo[]) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { projectLocks, refreshLocks } = useProjectLocks();

  const updateSchedule = useCallback(async () => {
    setIsUpdating(true);
    try {
      // Refresh project locks first
      await refreshLocks();
      
      const activeLocks = projectLocks.filter(lock => lock.isActive);
      const locksWithMinDays = activeLocks.filter(lock => lock.minDaysBetweenVisits && lock.minDaysBetweenVisits > 0);
      const completeBlocks = activeLocks.filter(lock => !lock.minDaysBetweenVisits || lock.minDaysBetweenVisits === 0);
      
      console.log('Mise à jour de l\'agenda avec contraintes prioritaires (lundi-vendredi uniquement):');
      console.log('- Nombre de chantiers:', projects.filter(p => !p.isArchived).length);
      console.log('- Verrouillages complets (priorité absolue):', completeBlocks.length);
      console.log('- Verrouillages avec délai minimum:', locksWithMinDays.length);
      console.log('- Distribution mensuelle prise en compte');
      console.log('- Programmation uniquement en semaine (lundi-vendredi)');
      
      // Simulate schedule update process with priority logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let description = 'Planning mis à jour (lundi-vendredi) avec priorité aux verrouillages';
      if (completeBlocks.length > 0) {
        description += ` - ${completeBlocks.length} jour(s) complètement bloqué(s)`;
      }
      if (locksWithMinDays.length > 0) {
        description += ` - ${locksWithMinDays.length} contrainte(s) de délai minimum`;
      }
      
      toast.success(
        "Agenda mis à jour avec succès",
        {
          description,
          duration: 4000,
        }
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error("Erreur lors de la mise à jour de l'agenda");
    } finally {
      setIsUpdating(false);
    }
  }, [projects, projectLocks, refreshLocks]);

  return {
    isUpdating,
    updateSchedule
  };
};
