
import React, { createContext, useContext } from 'react';
import { Team, Personnel, CustomTask, ProjectInfo, WorkLog, AppSettings, AuthState, User, UserRole } from '@/types/models';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Teams
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => Promise<Team>;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  
  // Personnel et Custom Tasks
  personnel: Personnel[];
  customTasks: CustomTask[];
  addPersonnel: (name: string, position?: string) => Promise<Personnel>;
  updatePersonnel: (personnel: Personnel) => Promise<void>;
  deletePersonnel: (id: string) => Promise<void>;
  togglePersonnelActive: (id: string, isActive: boolean) => Promise<void>;
  addCustomTask: (taskName: string) => Promise<CustomTask>;
  deleteCustomTask: (id: string) => Promise<void>;
  
  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  
  // Projects
  projectInfos: ProjectInfo[];
  selectedProjectId: string | null;
  addProjectInfo: (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => Promise<ProjectInfo>;
  updateProjectInfo: (projectInfo: ProjectInfo) => Promise<void>;
  deleteProjectInfo: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;
  getProjectById: (id: string) => ProjectInfo | undefined;
  getActiveProjects: () => ProjectInfo[];
  getArchivedProjects: () => ProjectInfo[];
  
  // WorkLogs
  workLogs: WorkLog[];
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => Promise<void>;
  deleteWorkLog: (id: string) => Promise<void>;
  deleteWorkLogsByProjectId: (projectId: string) => Promise<void>;
  archiveWorkLogsByProjectId: (projectId: string, archived: boolean) => Promise<void>;
  getWorkLogById: (id: string) => WorkLog | undefined;
  getWorkLogsByProjectId: (projectId: string) => WorkLog[];
  getTotalDuration: (projectId: string) => number;
  getTotalVisits: (projectId: string) => number;
  getLastVisitDate: (projectId: string) => Date | null;
  
  // Auth
  auth: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User | null;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getCurrentUser: () => User | null;
  canUserAccess: (requiredRole: UserRole) => boolean;
  
  // Loading states
  isLoading?: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { teams, addTeam, updateTeam, deleteTeam } = useTeams();
  const { 
    settings, 
    updateSettings, 
    addCustomTask, 
    deleteCustomTask, 
    addPersonnel, 
    updatePersonnel, 
    deletePersonnel, 
    getPersonnel, 
    togglePersonnelActive, 
    getCustomTasks 
  } = useSettings();
  const {
    projectInfos,
    selectedProjectId,
    isLoading: projectsLoading,
    addProjectInfo,
    updateProjectInfo,
    deleteProjectInfo,
    selectProject,
    getProjectById,
    getActiveProjects,
    getArchivedProjects,
  } = useProjects();
  const {
    workLogs,
    isLoading: workLogsLoading,
    addWorkLog,
    updateWorkLog,
    deleteWorkLog,
    deleteWorkLogsByProjectId,
    archiveWorkLogsByProjectId,
    getWorkLogById,
    getWorkLogsByProjectId,
    getTotalDuration,
    getTotalVisits,
    getLastVisitDate,
  } = useWorkLogs();
  const {
    auth,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    getCurrentUser,
    canUserAccess,
  } = useAuth();

  return (
    <AppContext.Provider
      value={{
        // Teams
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        
        // Personnel et Custom Tasks
        personnel: getPersonnel(),
        customTasks: getCustomTasks(),
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        togglePersonnelActive,
        addCustomTask,
        deleteCustomTask,
        
        // Settings
        settings,
        updateSettings,
        
        // Projects
        projectInfos,
        selectedProjectId,
        addProjectInfo,
        updateProjectInfo,
        deleteProjectInfo,
        selectProject,
        getProjectById,
        getActiveProjects,
        getArchivedProjects,
        
        // WorkLogs
        workLogs,
        addWorkLog,
        updateWorkLog,
        deleteWorkLog,
        deleteWorkLogsByProjectId,
        archiveWorkLogsByProjectId,
        getWorkLogById,
        getWorkLogsByProjectId,
        getTotalDuration,
        getTotalVisits,
        getLastVisitDate,
        
        // Auth
        auth,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        getCurrentUser,
        canUserAccess,
        
        // Loading states
        isLoading: projectsLoading || workLogsLoading,
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
