
import React, { createContext, useContext } from 'react';
import { AuthContextType, ProjectsContextType, WorkLogsContextType, TeamsContextType, SettingsContextType } from './types';
import { useAuth } from './AuthContext';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';

// Define the AppContextType explicitly here
interface AppContextType {
  auth: AuthContextType;
  projects: ProjectsContextType;
  workLogs: WorkLogsContextType;
  teams: TeamsContextType;
  settings: SettingsContextType;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Use the individual hooks to get context values
  const auth = useAuth();
  const projects = useProjects();
  const workLogs = useWorkLogs();
  const teams = useTeams();
  const settings = useSettings();

  // Combine all contexts into a single value
  const contextValue: AppContextType = {
    auth,
    projects,
    workLogs,
    teams,
    settings,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access all contexts
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider containing all context providers');
  }
  
  return context;
};
