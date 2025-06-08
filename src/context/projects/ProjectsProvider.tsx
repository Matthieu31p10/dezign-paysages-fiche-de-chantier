
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectsContextType } from '../types';
import { ProjectInfo } from '@/types/models';

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const queryClient = useQueryClient();

  // Fetch projects from Supabase
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Update local state when data changes
  useEffect(() => {
    if (projectsData) {
      const formattedProjects = projectsData.map(project => ({
        id: project.id,
        name: project.name,
        clientName: project.client_name || '',
        address: project.address,
        contactName: project.contact_name || '',
        contactPhone: project.contact_phone || '',
        contactEmail: project.contact_email || '',
        contractDetails: project.contract_details || '',
        contractDocumentUrl: project.contract_document_url || '',
        irrigation: project.irrigation || 'none',
        mowerType: project.mower_type || 'both',
        annualVisits: project.annual_visits || 0,
        annualTotalHours: project.annual_total_hours || 0,
        visitDuration: project.visit_duration || 0,
        additionalInfo: project.additional_info || '',
        team: project.team_id || '',
        projectType: project.project_type || '',
        startDate: project.start_date || '',
        endDate: project.end_date || '',
        isArchived: project.is_archived || false,
      }));
      setProjects(formattedProjects);
    }
  }, [projectsData]);

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (project: Omit<ProjectInfo, 'id'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: project.name,
          client_name: project.clientName,
          address: project.address,
          contact_name: project.contactName,
          contact_phone: project.contactPhone,
          contact_email: project.contactEmail,
          contract_details: project.contractDetails,
          contract_document_url: project.contractDocumentUrl,
          irrigation: project.irrigation,
          mower_type: project.mowerType,
          annual_visits: project.annualVisits,
          annual_total_hours: project.annualTotalHours,
          visit_duration: project.visitDuration,
          additional_info: project.additionalInfo,
          team_id: project.team,
          project_type: project.projectType,
          start_date: project.startDate,
          end_date: project.endDate,
          is_archived: project.isArchived,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...project }: ProjectInfo) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          client_name: project.clientName,
          address: project.address,
          contact_name: project.contactName,
          contact_phone: project.contactPhone,
          contact_email: project.contactEmail,
          contract_details: project.contractDetails,
          contract_document_url: project.contractDocumentUrl,
          irrigation: project.irrigation,
          mower_type: project.mowerType,
          annual_visits: project.annualVisits,
          annual_total_hours: project.annualTotalHours,
          visit_duration: project.visitDuration,
          additional_info: project.additionalInfo,
          team_id: project.team,
          project_type: project.projectType,
          start_date: project.startDate,
          end_date: project.endDate,
          is_archived: project.isArchived,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const addProject = (project: Omit<ProjectInfo, 'id'>) => {
    addProjectMutation.mutate(project);
  };

  const updateProject = (project: ProjectInfo) => {
    updateProjectMutation.mutate(project);
  };

  const deleteProject = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const value: ProjectsContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
