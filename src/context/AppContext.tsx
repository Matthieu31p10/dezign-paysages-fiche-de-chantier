
import React, { createContext, useContext } from 'react';
import { useTeams } from './TeamsContext';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useSettings } from './SettingsContext';

// Combinaison des contextes pour faciliter l'accès
const AppContext = createContext<any>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const teamsContext = useTeams();
  const projectsContext = useProjects();
  const workLogsContext = useWorkLogs();
  const settingsContext = useSettings();

  // Fonction pour obtenir les infos d'un projet par son ID
  const getProjectById = (projectId: string) => {
    const project = projectsContext.projectInfos.find(
      (project) => project.id === projectId
    );
    return project || null;
  };

  // Fonction pour obtenir le nom d'un projet par son ID
  const getProjectNameById = (projectId: string): string => {
    const project = getProjectById(projectId);
    return project ? project.name : 'Projet inconnu';
  };

  return (
    <AppContext.Provider
      value={{
        // Teams context
        teams: teamsContext.teams,
        addTeam: teamsContext.addTeam,
        updateTeam: teamsContext.updateTeam,
        deleteTeam: teamsContext.deleteTeam,
        
        // Projects context
        projects: projectsContext.projectInfos,
        addProject: projectsContext.addProjectInfo,
        updateProject: projectsContext.updateProjectInfo,
        deleteProject: projectsContext.deleteProjectInfo,
        getActiveProjects: projectsContext.getActiveProjects,
        getArchivedProjects: projectsContext.getArchivedProjects,
        
        // WorkLogs context
        workLogs: workLogsContext.workLogs,
        addWorkLog: workLogsContext.addWorkLog,
        updateWorkLog: workLogsContext.updateWorkLog,
        deleteWorkLog: workLogsContext.deleteWorkLog,
        getWorkLogsByProjectId: workLogsContext.getWorkLogsByProjectId,
        
        // Settings context
        settings: settingsContext.settings,
        updateSettings: settingsContext.updateSettings,
        
        // Helper functions
        getProjectById,
        getProjectNameById,
        projectInfos: projectsContext.projectInfos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
