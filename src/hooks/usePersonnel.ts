import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Personnel = {
  id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  hourly_rate?: number;
  skills?: string[];
  employee_id?: string;
  hire_date?: string;
  driving_license?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  active?: boolean;
  created_at?: string;
  updated_at: string;
};

export const usePersonnel = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast.error('Erreur lors du chargement du personnel');
    } finally {
      setLoading(false);
    }
  };

  const createPersonnel = async (personnelData: Omit<Personnel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert(personnelData)
        .select()
        .single();

      if (error) throw error;
      
      setPersonnel(prev => [...prev, data]);
      toast.success('Personnel ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Error creating personnel:', error);
      toast.error('Erreur lors de l\'ajout du personnel');
      throw error;
    }
  };

  const updatePersonnel = async (id: string, updates: Partial<Personnel>) => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPersonnel(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Personnel mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating personnel:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deletePersonnel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personnel')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;
      
      setPersonnel(prev => prev.filter(p => p.id !== id));
      toast.success('Personnel désactivé');
    } catch (error) {
      console.error('Error deactivating personnel:', error);
      toast.error('Erreur lors de la désactivation');
      throw error;
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  return {
    personnel,
    loading,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    refetch: fetchPersonnel
  };
};