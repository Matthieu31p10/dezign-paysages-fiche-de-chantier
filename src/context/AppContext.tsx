
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Team, AppSettings, ProjectInfo, WorkLog } from '@/types/models';
import { useSettings } from './SettingsContext';
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext/WorkLogsContext';
import { useTeams } from './TeamsContext';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Auth properties
  auth: {
    isAuthenticated: boolean;
    currentUser: User | null;
  };
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  canUserAccess: (requiredRole: UserRole | string) => boolean;
  getCurrentUser: () => User | null;
  
  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  
  // Teams
  teams: Team[];
  addTeam: (name: string) => Promise<Team>;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  
  // Users
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  
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
  
  // Work Logs
  workLogs: WorkLog[];
  isLoading: boolean;
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
  
  // Custom tasks and personnel
  addCustomTask: (taskName: string) => Promise<any>;
  customTasks: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const { settings, updateSettings, addCustomTask, getCustomTasks } = useSettings();
  const projects = useProjects();
  const workLogs = useWorkLogs();
  const teams = useTeams();

  const canUserAccess = (requiredRole: UserRole | string): boolean => {
    if (!auth.auth.currentUser) return false;
    
    if (typeof requiredRole === 'string' && requiredRole !== 'admin' && requiredRole !== 'manager' && requiredRole !== 'user') {
      // Module-based access control
      return true; // For now, allow access to all modules
    }
    
    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'manager': 2,
      'admin': 3
    };
    
    const userLevel = roleHierarchy[auth.auth.currentUser.role];
    const requiredLevel = roleHierarchy[requiredRole as UserRole];
    
    return userLevel >= requiredLevel;
  };

  const addTeam = async (name: string): Promise<Team> => {
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
    };
    await teams.addTeam(newTeam);
    return newTeam;
  };

  return (
    <AppContext.Provider
      value={{
        // Auth
        auth: auth.auth,
        currentUser: auth.auth.currentUser,
        login: auth.login,
        logout: auth.logout,
        canUserAccess,
        getCurrentUser: auth.getCurrentUser,
        
        // Settings
        settings,
        updateSettings,
        
        // Teams
        teams: teams.teams,
        addTeam,
        updateTeam: teams.updateTeam,
        deleteTeam: teams.deleteTeam,
        
        // Users
        addUser: auth.addUser,
        updateUser: auth.updateUser,
        deleteUser: auth.deleteUser,
        
        // Projects
        projectInfos: projects.projectInfos,
        selectedProjectId: projects.selectedProjectId,
        addProjectInfo: projects.addProjectInfo,
        updateProjectInfo: projects.updateProjectInfo,
        deleteProjectInfo: projects.deleteProjectInfo,
        selectProject: projects.selectProject,
        getProjectById: projects.getProjectById,
        getActiveProjects: projects.getActiveProjects,
        getArchivedProjects: projects.getArchivedProjects,
        
        // Work Logs
        workLogs: workLogs.workLogs,
        isLoading: workLogs.isLoading,
        addWorkLog: workLogs.addWorkLog,
        updateWorkLog: workLogs.updateWorkLog,
        deleteWorkLog: workLogs.deleteWorkLog,
        deleteWorkLogsByProjectId: workLogs.deleteWorkLogsByProjectId,
        archiveWorkLogsByProjectId: workLogs.archiveWorkLogsByProjectId,
        getWorkLogById: workLogs.getWorkLogById,
        getWorkLogsByProjectId: workLogs.getWorkLogsByProjectId,
        getTotalDuration: workLogs.getTotalDuration,
        getTotalVisits: workLogs.getTotalVisits,
        getLastVisitDate: workLogs.getLastVisitDate,
        
        // Custom tasks
        addCustomTask,
        customTasks: getCustomTasks(),
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
