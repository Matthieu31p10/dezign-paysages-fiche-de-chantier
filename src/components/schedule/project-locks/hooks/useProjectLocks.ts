
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
    toast.success('Verrouillage de jour ajouté avec succès');
  };

  const removeProjectLock = (lockId: string) => {
    setProjectLocks(prev => prev.filter(lock => lock.id !== lockId));
    toast.success('Verrouillage supprimé');
  };

  const toggleProjectLock = (lockId: string) => {
    setProjectLocks(prev => 
      prev.map(lock => 
        lock.id === lockId 
          ? { ...lock, isActive: !lock.isActive }
          : lock
      )
    );
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
