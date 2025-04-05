
import React, { createContext, useContext } from 'react';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { useWorkTasks } from './WorkTasksContext';

const AppContext = createContext<any>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projectsContext = useProjects();
  const workLogsContext = useWorkLogs();
  const teamsContext = useTeams();
  const settingsContext = useSettings();
  const authContext = useAuth();
  const workTasksContext = useWorkTasks();

  return (
    <AppContext.Provider
      value={{
        ...projectsContext,
        ...workLogsContext,
        ...teamsContext,
        ...settingsContext,
        ...authContext,
        ...workTasksContext
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
