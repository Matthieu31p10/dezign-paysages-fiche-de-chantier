
import React, { createContext, useContext, ReactNode } from 'react';
import { useProjects } from './ProjectsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useWorkLogs } from './WorkLogsContext/WorkLogsContext';
import { useAuth } from './AuthContext';
import { User, ProjectInfo, Team, AppSettings, WorkLog, Personnel, CustomTask, AuthState } from '@/types/models';

interface AppContextType {
  // Projects
  projects: ProjectInfo[];
  getProjectById: (id: string) => ProjectInfo | undefined;
  addProjectInfo: (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => Promise<ProjectInfo>;
  updateProjectInfo: (projectInfo: ProjectInfo) => Promise<void>;
  deleteProjectInfo: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;
  getActiveProjects: () => ProjectInfo[];
  getArchivedProjects: () => ProjectInfo[];
  
  // Teams
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => Promise<Team>;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  addCustomTask: (taskName: string) => Promise<CustomTask>;
  
  // Personnel from settings
  personnel: Personnel[];
  
  // Work logs
  workLogs: WorkLog[];
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => Promise<void>;
  deleteWorkLog: (id: string) => Promise<void>;
  isLoading: boolean;
  
  // Custom tasks
  customTasks: CustomTask[];
  
  // User management and permissions
  users: User[];
  canUserAccess: (module: string) => boolean;
  getCurrentUser: () => User | null;
  
  // Auth
  auth: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User | null;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  
  // Computed properties
  projectInfos: ProjectInfo[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { projectInfos, getProjectById, addProjectInfo, updateProjectInfo, deleteProjectInfo, selectProject, getActiveProjects, getArchivedProjects } = useProjects();
  const { teams, addTeam } = useTeams();
  const { settings, updateSettings, getPersonnel, addCustomTask, getCustomTasks } = useSettings();
  const { workLogs, isLoading, addWorkLog, updateWorkLog, deleteWorkLog } = useWorkLogs();
  const { auth, login, logout, addUser, updateUser, deleteUser, getCurrentUser, canUserAccess, users } = useAuth();
  
  // Get personnel from settings
  const personnel = getPersonnel();
  
  // Get custom tasks from settings
  const customTasks = getCustomTasks();
  
  const value: AppContextType = {
    // Projects
    projects: projectInfos,
    getProjectById,
    addProjectInfo,
    updateProjectInfo,
    deleteProjectInfo,
    selectProject,
    getActiveProjects,
    getArchivedProjects,
    projectInfos,
    
    // Teams
    teams,
    addTeam,
    
    // Settings
    settings,
    updateSettings,
    addCustomTask,
    
    // Personnel
    personnel,
    
    // Work logs
    workLogs,
    isLoading,
    addWorkLog,
    updateWorkLog,
    deleteWorkLog,
    
    // Custom tasks
    customTasks,
    
    // User management
    users,
    canUserAccess,
    getCurrentUser,
    
    // Auth
    auth,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
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
