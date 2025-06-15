
import React, { createContext, useContext, ReactNode } from 'react';
import { useProjects } from './ProjectsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useWorkLogs } from './WorkLogsContext/WorkLogsContext';
import { User, ProjectInfo, Team, AppSettings, WorkLog, Personnel } from '@/types/models';

interface AppContextType {
  // Projects
  projects: ProjectInfo[];
  getProjectById: (id: string) => ProjectInfo | undefined;
  
  // Teams
  teams: Team[];
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  
  // Personnel from settings
  personnel: Personnel[];
  
  // Work logs
  workLogs: WorkLog[];
  
  // User management and permissions
  users: User[];
  canUserAccess: (module: string) => boolean;
  getCurrentUser: () => User | null;
  
  // Computed properties
  projectInfos: ProjectInfo[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { projects, getProjectById } = useProjects();
  const { teams } = useTeams();
  const { settings, updateSettings, getPersonnel } = useSettings();
  const { workLogs } = useWorkLogs();
  
  // Get personnel from settings
  const personnel = getPersonnel();
  
  // Mock user management - à remplacer par une vraie authentification
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrateur',
      email: 'admin@example.com',
      createdAt: new Date(),
      permissions: {
        admin: true,
        projects: true,
        worklogs: true,
        reports: true,
        blanksheets: true
      }
    }
  ];
  
  const getCurrentUser = (): User | null => {
    // Mock - retourne toujours l'admin pour l'instant
    return mockUsers[0];
  };
  
  const canUserAccess = (module: string): boolean => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Admin a accès à tout
    if (currentUser.role === 'admin') return true;
    
    // Vérifier les permissions spécifiques
    return currentUser.permissions?.[module] === true;
  };
  
  const value: AppContextType = {
    // Projects
    projects,
    getProjectById,
    projectInfos: projects,
    
    // Teams
    teams,
    
    // Settings
    settings,
    updateSettings,
    
    // Personnel
    personnel,
    
    // Work logs
    workLogs,
    
    // User management
    users: mockUsers,
    canUserAccess,
    getCurrentUser,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
