
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
      const affectedProjects = activeLocks.length > 0 
        ? [...new Set(activeLocks.map(lock => lock.projectId))].length 
        : 0;
      
      console.log('Mise à jour de l\'agenda avec les contraintes suivantes:');
      console.log('- Nombre de chantiers:', projects.filter(p => !p.isArchived).length);
      console.log('- Nombre de verrouillages actifs:', activeLocks.length);
      console.log('- Nombre de chantiers affectés:', affectedProjects);
      
      // Simulate schedule update process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        "Agenda mis à jour avec succès",
        {
          description: `${activeLocks.length} verrouillage${activeLocks.length > 1 ? 's' : ''} et distribution mensuelle pris en compte`,
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
