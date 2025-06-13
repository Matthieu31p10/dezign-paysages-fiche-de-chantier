
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectInfo } from '@/types/models';
import { ProjectsContextType } from './types';
import { toast } from 'sonner';
import { useWorkLogs } from './WorkLogsContext/WorkLogsContext';
import { loadProjectsFromStorage, saveProjectsToStorage, deleteProjectFromStorage } from './projects/storage/projectOperations';

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectInfos, setProjectInfos] = useState<ProjectInfo[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { deleteWorkLogsByProjectId, archiveWorkLogsByProjectId } = useWorkLogs();

  // Load projects from Supabase on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const loadedProjects = await loadProjectsFromStorage();
        setProjectInfos(loadedProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Erreur lors du chargement des projets");
        setProjectInfos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const addProjectInfo = async (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => {
    const newProjectInfo: ProjectInfo = {
      ...projectInfo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    try {
      // Save to Supabase
      await saveProjectsToStorage([...projectInfos, newProjectInfo]);
      setProjectInfos((prev) => [...prev, newProjectInfo]);
      toast.success('Fiche chantier créée');
      return newProjectInfo;
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error('Erreur lors de la création du projet');
      throw error;
    }
  };

  const updateProjectInfo = async (projectInfo: ProjectInfo) => {
    const oldProject = projectInfos.find(p => p.id === projectInfo.id);
    const updatedProjects = projectInfos.map((p) => (p.id === projectInfo.id ? projectInfo : p));
    
    try {
      // Save to Supabase
      await saveProjectsToStorage(updatedProjects);
      setProjectInfos(updatedProjects);
      
      // Si l'état d'archivage a changé, mettre à jour les fiches de suivi
      if (oldProject && oldProject.isArchived !== projectInfo.isArchived) {
        archiveWorkLogsByProjectId(projectInfo.id, !!projectInfo.isArchived);
      }
      
      toast.success('Fiche chantier mise à jour');
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error('Erreur lors de la mise à jour du projet');
      throw error;
    }
  };

  const deleteProjectInfo = async (id: string) => {
    try {
      // Delete from Supabase
      await deleteProjectFromStorage(id);
      setProjectInfos((prev) => prev.filter((p) => p.id !== id));
      deleteWorkLogsByProjectId(id);
      toast.success('Fiche chantier supprimée');
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error('Erreur lors de la suppression du projet');
      throw error;
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
        isLoading,
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
