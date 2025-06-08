
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
      const formattedProjects: ProjectInfo[] = projectsData.map(project => ({
        id: project.id,
        name: project.name,
        clientName: project.client_name || '',
        address: project.address,
        contact: {
          name: project.contact_name || '',
          phone: project.contact_phone || '',
          email: project.contact_email || '',
        },
        contract: {
          details: project.contract_details || '',
          documentUrl: project.contract_document_url || '',
        },
        irrigation: (project.irrigation as "irrigation" | "none" | "disabled") || 'none',
        mowerType: (project.mower_type as "manual" | "robot" | "both") || 'both',
        annualVisits: project.annual_visits || 0,
        annualTotalHours: project.annual_total_hours || 0,
        visitDuration: project.visit_duration || 0,
        additionalInfo: project.additional_info || '',
        team: project.team_id || '',
        projectType: project.project_type || '',
        startDate: project.start_date ? new Date(project.start_date) : null,
        endDate: project.end_date ? new Date(project.end_date) : null,
        isArchived: project.is_archived || false,
        createdAt: new Date(project.created_at),
      }));
      setProjects(formattedProjects);
    }
  }, [projectsData]);

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (project: Omit<ProjectInfo, 'id' | 'createdAt'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: project.name,
          client_name: project.clientName,
          address: project.address,
          contact_name: project.contact?.name,
          contact_phone: project.contact?.phone,
          contact_email: project.contact?.email,
          contract_details: project.contract?.details,
          contract_document_url: project.contract?.documentUrl,
          irrigation: project.irrigation,
          mower_type: project.mowerType,
          annual_visits: project.annualVisits,
          annual_total_hours: project.annualTotalHours,
          visit_duration: project.visitDuration,
          additional_info: project.additionalInfo,
          team_id: project.team,
          project_type: project.projectType,
          start_date: project.startDate?.toISOString(),
          end_date: project.endDate?.toISOString(),
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
    mutationFn: async (project: ProjectInfo) => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          client_name: project.clientName,
          address: project.address,
          contact_name: project.contact?.name,
          contact_phone: project.contact?.phone,
          contact_email: project.contact?.email,
          contract_details: project.contract?.details,
          contract_document_url: project.contract?.documentUrl,
          irrigation: project.irrigation,
          mower_type: project.mowerType,
          annual_visits: project.annualVisits,
          annual_total_hours: project.annualTotalHours,
          visit_duration: project.visitDuration,
          additional_info: project.additionalInfo,
          team_id: project.team,
          project_type: project.projectType,
          start_date: project.startDate?.toISOString(),
          end_date: project.endDate?.toISOString(),
          is_archived: project.isArchived,
        })
        .eq('id', project.id)
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

  const addProjectInfo = (project: Omit<ProjectInfo, 'id' | 'createdAt'>) => {
    const newProject: ProjectInfo = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    addProjectMutation.mutate(project);
    return newProject;
  };

  const updateProjectInfo = (project: ProjectInfo) => {
    updateProjectMutation.mutate(project);
  };

  const deleteProjectInfo = (id: string) => {
    deleteProjectMutation.mutate(id);
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const getActiveProjects = () => {
    return projects.filter(project => !project.isArchived);
  };

  const getArchivedProjects = () => {
    return projects.filter(project => project.isArchived);
  };

  const selectProject = (id: string | null) => {
    // Implementation for selecting a project
  };

  const value: ProjectsContextType = {
    projectInfos: projects,
    selectedProjectId: null,
    addProjectInfo,
    updateProjectInfo,
    deleteProjectInfo,
    selectProject,
    getProjectById,
    getActiveProjects,
    getArchivedProjects,
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
