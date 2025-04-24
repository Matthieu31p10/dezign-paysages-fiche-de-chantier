
import React, { createContext, useContext, useMemo } from 'react';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { 
  ProjectsContextType, 
  WorkLogsContextType, 
  TeamsContextType, 
  SettingsContextType, 
  AuthContextType 
} from './types';
import { WorkLog } from '@/types/models';

// Create a type that combines all the context types
export type AppContextType = ProjectsContextType & 
  WorkLogsContextType & 
  TeamsContextType & 
  SettingsContextType & 
  AuthContextType & {
    // Add any additional app-wide methods or state here
    workLogs: WorkLog[];
    isLoading: boolean;
  };

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projects = useProjects();
  const workLogsContext = useWorkLogs();
  const teams = useTeams();
  const settings = useSettings();
  const auth = useAuth();

  // Check if any context is loading
  const isLoading = useMemo(() => {
    return (
      workLogsContext.isLoading || 
      (projects as any).isLoading || 
      false
    );
  }, [workLogsContext.isLoading, (projects as any).isLoading]);

  // Combine all contexts
  const value = useMemo<AppContextType>(() => ({
    // Projects context
    ...projects,
    
    // WorkLogs context
    ...workLogsContext,
    workLogs: workLogsContext.workLogs,
    
    // Teams context
    ...teams,
    
    // Settings context
    ...settings,
    
    // Auth context
    ...auth,
    
    // Global app state
    isLoading
  }), [projects, workLogsContext, teams, settings, auth, isLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export for backward compatibility
export { AppContext };
