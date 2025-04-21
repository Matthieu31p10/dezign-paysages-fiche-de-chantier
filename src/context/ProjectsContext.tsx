
import React, { createContext, useContext, useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { ProjectsContextType } from './types';
import { toast } from 'sonner';
import { useWorkLogs } from './WorkLogsContext';

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectInfos, setProjectInfos] = useState<ProjectInfo[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { deleteWorkLogsByProjectId, archiveWorkLogsByProjectId } = useWorkLogs();

  // In the future, load data from database on initial render
  // This would be implemented with a React Query hook

  const addProjectInfo = (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => {
    const newProjectInfo: ProjectInfo = {
      ...projectInfo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setProjectInfos((prev) => [...prev, newProjectInfo]);
    // In the future, save to database
    toast.success('Fiche chantier créée');
    return newProjectInfo;
  };

  const updateProjectInfo = (projectInfo: ProjectInfo) => {
    const oldProject = projectInfos.find(p => p.id === projectInfo.id);
    setProjectInfos((prev) => prev.map((p) => (p.id === projectInfo.id ? projectInfo : p)));
    
    // Si l'état d'archivage a changé, mettre à jour les fiches de suivi
    if (oldProject && oldProject.isArchived !== projectInfo.isArchived) {
      archiveWorkLogsByProjectId(projectInfo.id, !!projectInfo.isArchived);
    }
    
    // In the future, update in database
    toast.success('Fiche chantier mise à jour');
  };

  const deleteProjectInfo = (id: string) => {
    setProjectInfos((prev) => prev.filter((p) => p.id !== id));
    deleteWorkLogsByProjectId(id);
    // In the future, delete from database
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
