
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectDayLock } from '../types';

export const useProjectLocksData = () => {
  const [projectLocks, setProjectLocks] = useState<ProjectDayLock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectLocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('project_day_locks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erreur lors de la récupération des verrouillages:', fetchError);
        setError('Erreur lors de la récupération des verrouillages');
        return;
      }

      const locks: ProjectDayLock[] = data.map(row => ({
        id: row.id,
        projectId: row.project_id,
        dayOfWeek: row.day_of_week,
        reason: row.reason,
        description: row.description || '',
        isActive: row.is_active,
        createdAt: new Date(row.created_at),
        minDaysBetweenVisits: row.min_days_between_visits,
      }));

      setProjectLocks(locks);
    } catch (error) {
      console.error('Erreur lors de la récupération des verrouillages:', error);
      setError('Erreur lors de la récupération des verrouillages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshLocks = useCallback(() => {
    fetchProjectLocks();
  }, [fetchProjectLocks]);

  useEffect(() => {
    fetchProjectLocks();
  }, [fetchProjectLocks]);

  return {
    projectLocks,
    setProjectLocks,
    isLoading,
    error,
    refreshLocks,
  };
};
