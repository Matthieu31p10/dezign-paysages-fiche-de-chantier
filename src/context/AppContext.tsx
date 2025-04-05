
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
  Omit<SettingsContextType, 'updateUser'> & 
  Omit<AuthContextType, 'updateUser'> & {
    // Add any additional app-wide methods or state here
    updateUser: AuthContextType['updateUser']; // We'll use the auth version
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
    
    // Settings context (except updateUser)
    settings: settings.settings,
    updateSettings: settings.updateSettings,
    addPersonnel: settings.addPersonnel,
    updatePersonnel: settings.updatePersonnel,
    deletePersonnel: settings.deletePersonnel,
    addCustomTask: settings.addCustomTask,
    updateCustomTask: settings.updateCustomTask,
    deleteCustomTask: settings.deleteCustomTask,
    getCustomTasks: settings.getCustomTasks,
    getPersonnel: settings.getPersonnel,
    
    // Auth context (except updateUser)
    auth: auth.auth,
    login: auth.login,
    logout: auth.logout,
    addUser: auth.addUser,
    deleteUser: auth.deleteUser,
    getCurrentUser: auth.getCurrentUser,
    
    // Explicitly add the auth version of updateUser
    updateUser: auth.updateUser,
    
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
