
import React, { createContext, useContext } from 'react';
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

// Create a type that combines all the context types
type AppContextType = ProjectsContextType & 
  WorkLogsContextType & 
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
  const teams = useTeams();
  const settings = useSettings();
  const auth = useAuth();

  // Combine all contexts
  const value: AppContextType = {
    // Projects context
    ...projects,
    
    // WorkLogs context
    ...workLogs,
    
    // Teams context
    ...teams,
    
    // Settings context
    ...settings,
    
    // Auth context
    ...auth,
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
