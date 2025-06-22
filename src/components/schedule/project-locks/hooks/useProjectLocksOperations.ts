
import { ProjectDayLock, ProjectLockFormData } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useProjectLocksOperations = (
  setProjectLocks: React.Dispatch<React.SetStateAction<ProjectDayLock[]>>
) => {
  const addProjectLock = async (formData: ProjectLockFormData) => {
    try {
      const { data, error } = await supabase
        .from('project_day_locks')
        .insert({
          project_id: formData.projectId,
          day_of_week: formData.dayOfWeek,
          reason: formData.reason,
          description: formData.description || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du verrouillage:', error);
        if (error.code === '23505') {
          toast.error('Un verrouillage existe déjà pour ce chantier et ce jour de la semaine');
        } else {
          toast.error('Erreur lors de la création du verrouillage');
        }
        return;
      }

      const newLock: ProjectDayLock = {
        id: data.id,
        projectId: data.project_id,
        dayOfWeek: data.day_of_week,
        reason: data.reason,
        description: data.description || '',
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
      };

      setProjectLocks(prev => [newLock, ...prev]);
      
      const dayNames = ['', 'lundis', 'mardis', 'mercredis', 'jeudis', 'vendredis', 'samedis', 'dimanches'];
      const dayName = dayNames[formData.dayOfWeek] || 'jours';
      
      toast.success(
        `Verrouillage créé avec succès`,
        {
          description: `Tous les passages de ce chantier sont maintenant bloqués les ${dayName}.`,
          duration: 4000,
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création du verrouillage:', error);
      toast.error('Erreur lors de la création du verrouillage');
    }
  };

  const removeProjectLock = async (lockId: string, projectLocks: ProjectDayLock[]) => {
    try {
      const lock = projectLocks.find(l => l.id === lockId);
      
      const { error } = await supabase
        .from('project_day_locks')
        .delete()
        .eq('id', lockId);

      if (error) {
        console.error('Erreur lors de la suppression du verrouillage:', error);
        toast.error('Erreur lors de la suppression du verrouillage');
        return;
      }

      setProjectLocks(prev => prev.filter(l => l.id !== lockId));
      
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
    } catch (error) {
      console.error('Erreur lors de la suppression du verrouillage:', error);
      toast.error('Erreur lors de la suppression du verrouillage');
    }
  };

  const toggleProjectLock = async (lockId: string, projectLocks: ProjectDayLock[]) => {
    try {
      const lock = projectLocks.find(l => l.id === lockId);
      if (!lock) return;

      const newActiveState = !lock.isActive;

      const { error } = await supabase
        .from('project_day_locks')
        .update({ 
          is_active: newActiveState,
          updated_at: new Date().toISOString()
        })
        .eq('id', lockId);

      if (error) {
        console.error('Erreur lors de la mise à jour du verrouillage:', error);
        toast.error('Erreur lors de la mise à jour du verrouillage');
        return;
      }

      setProjectLocks(prev => 
        prev.map(l => 
          l.id === lockId 
            ? { ...l, isActive: newActiveState }
            : l
        )
      );

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
    } catch (error) {
      console.error('Erreur lors de la mise à jour du verrouillage:', error);
      toast.error('Erreur lors de la mise à jour du verrouillage');
    }
  };

  return {
    addProjectLock,
    removeProjectLock,
    toggleProjectLock,
  };
};
