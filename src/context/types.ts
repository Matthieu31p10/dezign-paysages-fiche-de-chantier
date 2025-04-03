
import { ProjectInfo, WorkLog, Team, AppSettings, User, UserRole, AuthState, Personnel } from '@/types/models';

export interface ProjectsContextType {
  projectInfos: ProjectInfo[];
  selectedProjectId: string | null;
  addProjectInfo: (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => ProjectInfo;
  updateProjectInfo: (projectInfo: ProjectInfo) => void;
  deleteProjectInfo: (id: string) => void;
  selectProject: (id: string | null) => void;
  getProjectById: (id: string) => ProjectInfo | undefined;
  getActiveProjects: () => ProjectInfo[];
  getArchivedProjects: () => ProjectInfo[];
}

export interface WorkLogsContextType {
  workLogs: WorkLog[];
  addWorkLog: (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => WorkLog;
  updateWorkLog: (workLog: WorkLog) => void;
  deleteWorkLog: (id: string) => void;
  getWorkLogsByProjectId: (projectId: string) => WorkLog[];
}

export interface TeamsContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User | null;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getCurrentUser: () => User | null;
  canUserAccess: (requiredRole: UserRole) => boolean;
}

// Add the missing types
export interface AuthProviderProps {
  children: React.ReactNode;
  currentUser?: User | null;
  isAuthenticated?: boolean;
}

export interface AppContextType {
  auth: AuthState;
  projects: ProjectsContextType;
  workLogs: WorkLogsContextType;
  teams: TeamsContextType;
  settings: SettingsContextType;
}
