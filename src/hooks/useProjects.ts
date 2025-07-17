import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Project = {
  id: string;
  name: string;
  address: string;
  client_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  annual_visits?: number;
  annual_total_hours?: number;
  visit_duration?: number;
  mower_type?: string;
  irrigation?: string;
  contract_details?: string;
  contract_document_url?: string;
  additional_info?: string;
  is_archived?: boolean;
  created_at?: string;
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      toast.success('Projet créé avec succès');
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Erreur lors de la création du projet');
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Projet mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Projet archivé');
    } catch (error) {
      console.error('Error archiving project:', error);
      toast.error('Erreur lors de l\'archivage');
      throw error;
    }
  };

  const getProject = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Erreur lors du chargement du projet');
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    refetch: fetchProjects
  };
};