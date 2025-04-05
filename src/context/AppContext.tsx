
import React, { createContext, useContext } from 'react';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useWorkTasks } from './WorkTasksContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { 
  ProjectsContextType, 
  WorkLogsContextType, 
  WorkTasksContextType,
  TeamsContextType, 
  SettingsContextType, 
  AuthContextType 
} from './types';
import { UserRole } from '@/types/models';

// Create a type that combines all the context types
type AppContextType = ProjectsContextType & 
  WorkLogsContextType & 
  WorkTasksContextType &
  TeamsContextType & 
  SettingsContextType & 
  AuthContextType & {
    // Add any additional app-wide methods or state here
  };

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projects = useProjects();
  const workLogs = useWorkLogs();
  const workTasks = useWorkTasks();
  const teams = useTeams();
  const settings = useSettings();
  const auth = useAuth();

  // Combine all contexts
  const value: AppContextType = {
    // Projects context
    ...projects,
    
    // WorkLogs context
    ...workLogs,
    
    // WorkTasks context
    ...workTasks,
    
    // Teams context
    ...teams,
    
    // Settings context
    ...settings,
    
    // Auth context
    ...auth,
    
    // Make sure canUserAccess is properly exposed
    canUserAccess: (requiredRole: UserRole) => {
      return auth.canUserAccess(requiredRole);
    }
  };

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
