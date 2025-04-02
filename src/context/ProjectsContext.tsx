
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectInfo } from '@/types/models';
import { ProjectsContextType } from './types';
import { toast } from 'sonner';
import { useWorkLogs } from './WorkLogsContext';

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

// Local storage key
const PROJECTS_STORAGE_KEY = 'landscaping-projects';
const SELECTED_PROJECT_KEY = 'landscaping-selected-project';

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectInfos, setProjectInfos] = useState<ProjectInfo[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { deleteWorkLogsByProjectId } = useWorkLogs();

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const storedSelectedProject = localStorage.getItem(SELECTED_PROJECT_KEY);

      if (storedProjects) setProjectInfos(JSON.parse(storedProjects));
      if (storedSelectedProject) setSelectedProjectId(storedSelectedProject);
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      toast.error('Erreur lors du chargement des projets');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectInfos));
  }, [projectInfos]);

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem(SELECTED_PROJECT_KEY, selectedProjectId);
    } else {
      localStorage.removeItem(SELECTED_PROJECT_KEY);
    }
  }, [selectedProjectId]);

  const addProjectInfo = (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => {
    const newProjectInfo: ProjectInfo = {
      ...projectInfo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setProjectInfos((prev) => [...prev, newProjectInfo]);
    toast.success('Fiche chantier créée');
    return newProjectInfo;
  };

  const updateProjectInfo = (projectInfo: ProjectInfo) => {
    setProjectInfos((prev) =>
      prev.map((p) => (p.id === projectInfo.id ? projectInfo : p))
    );
    toast.success('Fiche chantier mise à jour');
  };

  const deleteProjectInfo = (id: string) => {
    setProjectInfos((prev) => prev.filter((p) => p.id !== id));
    deleteWorkLogsByProjectId(id);
    toast.success('Fiche chantier supprimée');
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const selectProject = (id: string | null) => {
    setSelectedProjectId(id);
  };

  const getProjectById = (id: string) => {
    return projectInfos.find((project) => project.id === id);
  };

  const getActiveProjects = () => {
    return projectInfos.filter(project => !project.isArchived);
  };

  const getArchivedProjects = () => {
    return projectInfos.filter(project => project.isArchived);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projectInfos,
        selectedProjectId,
        addProjectInfo,
        updateProjectInfo,
        deleteProjectInfo,
        selectProject,
        getProjectById,
        getActiveProjects,
        getArchivedProjects,
      }}
    >
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
