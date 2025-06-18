
import { useState } from 'react';
import { ProjectDayLock, ProjectLockFormData } from '../types';
import { toast } from 'sonner';

export const useProjectLocks = () => {
  const [projectLocks, setProjectLocks] = useState<ProjectDayLock[]>([]);

  const addProjectLock = (formData: ProjectLockFormData) => {
    const newLock: ProjectDayLock = {
      id: crypto.randomUUID(),
      projectId: formData.projectId,
      dayOfWeek: formData.dayOfWeek,
      reason: formData.reason,
      description: formData.description,
      isActive: true,
      createdAt: new Date(),
    };

    setProjectLocks(prev => [...prev, newLock]);
    
    const dayNames = ['', 'lundis', 'mardis', 'mercredis', 'jeudis', 'vendredis', 'samedis', 'dimanches'];
    const dayName = dayNames[formData.dayOfWeek] || 'jours';
    
    toast.success(
      `Verrouillage créé avec succès`,
      {
        description: `Tous les passages de ce chantier sont maintenant bloqués les ${dayName}.`,
        duration: 4000,
      }
    );
  };

  const removeProjectLock = (lockId: string) => {
    const lock = projectLocks.find(l => l.id === lockId);
    setProjectLocks(prev => prev.filter(lock => lock.id !== lockId));
    
    if (lock) {
      const dayNames = ['', 'lundis', 'mardis', 'mercredis', 'jeudis', 'vendredis', 'samedis', 'dimanches'];
      const dayName = dayNames[lock.dayOfWeek] || 'jours';
      
      toast.success(
        'Verrouillage supprimé',
        {
          description: `Les passages les ${dayName} sont maintenant déverrouillés.`,
          duration: 3000,
        }
      );
    }
  };

  const toggleProjectLock = (lockId: string) => {
    const lock = projectLocks.find(l => l.id === lockId);
    
    setProjectLocks(prev => 
      prev.map(lock => 
        lock.id === lockId 
          ? { ...lock, isActive: !lock.isActive }
          : lock
      )
    );

    if (lock) {
      const dayNames = ['', 'lundis', 'mardis', 'mercredis', 'jeudis', 'vendredis', 'samedis', 'dimanches'];
      const dayName = dayNames[lock.dayOfWeek] || 'jours';
      const action = lock.isActive ? 'désactivé' : 'activé';
      
      toast.info(
        `Verrouillage ${action}`,
        {
          description: `Le verrouillage des ${dayName} a été ${action}.`,
          duration: 3000,
        }
      );
    }
  };

  const getLocksForProject = (projectId: string) => {
    return projectLocks.filter(lock => lock.projectId === projectId && lock.isActive);
  };

  const isProjectLockedOnDay = (projectId: string, dayOfWeek: number) => {
    return projectLocks.some(
      lock => lock.projectId === projectId && 
               lock.dayOfWeek === dayOfWeek && 
               lock.isActive
    );
  };

  return {
    projectLocks,
    addProjectLock,
    removeProjectLock,
    toggleProjectLock,
    getLocksForProject,
    isProjectLockedOnDay,
  };
};
