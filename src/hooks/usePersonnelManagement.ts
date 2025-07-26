import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Personnel } from '@/types/models';

export const usePersonnelManagement = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load personnel from Supabase
  const loadPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedPersonnel: Personnel[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        position: item.position || '',
        active: item.active ?? true
      }));

      setPersonnel(mappedPersonnel);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error loading personnel:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement du personnel');
    } finally {
      setLoading(false);
    }
  };

  // Add personnel to Supabase
  const addPersonnel = async (name: string, position?: string): Promise<Personnel> => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert({
          name: name.trim(),
          position: position?.trim() || null,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      const newPersonnel: Personnel = {
        id: data.id,
        name: data.name,
        position: data.position || '',
        active: data.active ?? true
      };

      setPersonnel(prev => [...prev, newPersonnel]);
      toast.success('Personnel ajouté avec succès');
      return newPersonnel;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error adding personnel:', error);
      toast.error('Erreur lors de l\'ajout du personnel');
      throw error;
    }
  };

  // Update personnel in Supabase
  const updatePersonnel = async (personnelData: Personnel): Promise<void> => {
    try {
      const { error } = await supabase
        .from('personnel')
        .update({
          name: personnelData.name.trim(),
          position: personnelData.position?.trim() || null,
          active: personnelData.active
        })
        .eq('id', personnelData.id);

      if (error) throw error;

      setPersonnel(prev => 
        prev.map(p => p.id === personnelData.id ? personnelData : p)
      );
      toast.success('Personnel mis à jour avec succès');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error updating personnel:', error);
      toast.error('Erreur lors de la mise à jour du personnel');
      throw error;
    }
  };

  // Delete personnel from Supabase
  const deletePersonnel = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPersonnel(prev => prev.filter(p => p.id !== id));
      toast.success('Personnel supprimé avec succès');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error deleting personnel:', error);
      toast.error('Erreur lors de la suppression du personnel');
      throw error;
    }
  };

  // Toggle personnel active status
  const togglePersonnelActive = async (id: string, isActive: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('personnel')
        .update({ active: isActive })
        .eq('id', id);

      if (error) throw error;

      setPersonnel(prev => 
        prev.map(p => p.id === id ? { ...p, active: isActive } : p)
      );
      toast.success(`Personnel ${isActive ? 'activé' : 'désactivé'} avec succès`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error toggling personnel active status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }
  };

  // Real-time subscription to personnel changes
  useEffect(() => {
    loadPersonnel();

    const channel = supabase
      .channel('personnel-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personnel'
        },
        (payload) => {
          console.log('Personnel changed:', payload);
          if (payload.eventType === 'INSERT') {
            const newPersonnel: Personnel = {
              id: payload.new.id,
              name: payload.new.name,
              position: payload.new.position || '',
              active: payload.new.active ?? true
            };
            setPersonnel(prev => [...prev, newPersonnel]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedPersonnel: Personnel = {
              id: payload.new.id,
              name: payload.new.name,
              position: payload.new.position || '',
              active: payload.new.active ?? true
            };
            setPersonnel(prev => 
              prev.map(p => p.id === updatedPersonnel.id ? updatedPersonnel : p)
            );
          } else if (payload.eventType === 'DELETE') {
            setPersonnel(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    personnel,
    loading,
    error,
    loadPersonnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    togglePersonnelActive
  };
};