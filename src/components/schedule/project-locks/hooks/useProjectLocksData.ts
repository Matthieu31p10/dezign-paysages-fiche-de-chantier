
import { useState, useEffect } from 'react';
import { ProjectDayLock } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProjectLocksData = () => {
  const [projectLocks, setProjectLocks] = useState<ProjectDayLock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjectLocks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('project_day_locks')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Erreur lors du chargement des verrouillages:', supabaseError);
        setError(new Error(`Erreur de base de données: ${supabaseError.message}`));
        toast.error('Erreur lors du chargement des verrouillages');
        return;
      }

      const formattedLocks: ProjectDayLock[] = data.map(lock => ({
        id: lock.id,
        projectId: lock.project_id,
        dayOfWeek: lock.day_of_week,
        reason: lock.reason,
        description: lock.description || '',
        isActive: lock.is_active,
        createdAt: new Date(lock.created_at),
      }));

      setProjectLocks(formattedLocks);
    } catch (error) {
      console.error('Erreur lors du chargement des verrouillages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(new Error(errorMessage));
      toast.error('Erreur lors du chargement des verrouillages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjectLocks();
  }, []);

  return {
    projectLocks,
    setProjectLocks,
    isLoading,
    error,
    refreshLocks: loadProjectLocks,
  };
};
