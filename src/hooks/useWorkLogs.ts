import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type WorkLog = {
  id: string;
  project_id: string;
  date: string;
  personnel: string[];
  arrival?: string;
  departure?: string;
  break_time?: string;
  end_time?: string;
  total_hours: number;
  tasks?: string;
  notes?: string;
  address?: string;
  client_name?: string;
  contact_email?: string;
  contact_phone?: string;
  hourly_rate?: number;
  water_consumption?: number;
  waste_management?: string;
  client_signature?: string;
  is_quote_signed?: boolean;
  signed_quote_amount?: number;
  invoiced?: boolean;
  is_archived?: boolean;
  created_at?: string;
  created_by?: string;
  linked_project_id?: string;
};

export const useWorkLogs = () => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .select(`
          *,
          project:projects(name, address)
        `)
        .eq('is_archived', false)
        .order('date', { ascending: false });

      if (error) throw error;
      setWorkLogs(data || []);
    } catch (error) {
      console.error('Error fetching work logs:', error);
      toast.error('Erreur lors du chargement des fiches de travail');
    } finally {
      setLoading(false);
    }
  };

  const createWorkLog = async (workLogData: Omit<WorkLog, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .insert(workLogData)
        .select()
        .single();

      if (error) throw error;
      
      setWorkLogs(prev => [data, ...prev]);
      toast.success('Fiche de travail créée avec succès');
      return data;
    } catch (error) {
      console.error('Error creating work log:', error);
      toast.error('Erreur lors de la création de la fiche');
      throw error;
    }
  };

  const updateWorkLog = async (id: string, updates: Partial<WorkLog>) => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setWorkLogs(prev => prev.map(w => w.id === id ? data : w));
      toast.success('Fiche mise à jour');
      return data;
    } catch (error) {
      console.error('Error updating work log:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteWorkLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_logs')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;
      
      setWorkLogs(prev => prev.filter(w => w.id !== id));
      toast.success('Fiche archivée');
    } catch (error) {
      console.error('Error archiving work log:', error);
      toast.error('Erreur lors de l\'archivage');
      throw error;
    }
  };

  const getWorkLog = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .select(`
          *,
          project:projects(name, address),
          consumables(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching work log:', error);
      toast.error('Erreur lors du chargement de la fiche');
      throw error;
    }
  };

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  return {
    workLogs,
    loading,
    createWorkLog,
    updateWorkLog,
    deleteWorkLog,
    getWorkLog,
    refetch: fetchWorkLogs
  };
};