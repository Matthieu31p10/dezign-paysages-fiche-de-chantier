import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectInfo } from '@/types/models';
import { toast } from 'sonner';

interface UseProjectsRealtimeProps {
  onProjectUpdate: (project: ProjectInfo) => void;
  onProjectDelete: (projectId: string) => void;
  onProjectInsert: (project: ProjectInfo) => void;
}

export const useProjectsRealtime = ({
  onProjectUpdate,
  onProjectDelete,
  onProjectInsert
}: UseProjectsRealtimeProps) => {
  const handleRealtimeUpdate = useCallback((payload: any) => {
    const { eventType, new: newData, old: oldData } = payload;
    
    switch (eventType) {
      case 'INSERT':
        onProjectInsert(newData as ProjectInfo);
        toast.success('Nouveau projet ajouté');
        break;
        
      case 'UPDATE':
        onProjectUpdate(newData as ProjectInfo);
        toast.info('Projet mis à jour');
        break;
        
      case 'DELETE':
        onProjectDelete(oldData.id);
        toast.info('Projet supprimé');
        break;
    }
  }, [onProjectUpdate, onProjectDelete, onProjectInsert]);

  useEffect(() => {
    // Enable realtime for projects table
    const channel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime connection established for projects');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Failed to establish realtime connection');
          toast.error('Connexion temps réel échouée');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleRealtimeUpdate]);

  return {
    // No return values needed, this hook just manages the realtime subscription
  };
};