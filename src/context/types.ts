
import { ProjectInfo, WorkLog, WorkTask, Team, AppSettings, User, UserRole, Personnel, CustomTask } from '@/types/models';

export interface ProjectsContextType {
  projectInfos: ProjectInfo[];
  selectedProjectId?: string | null;
  addProjectInfo: (project: Omit<ProjectInfo, 'id' | 'createdAt'>) => ProjectInfo;
  updateProjectInfo: (project: ProjectInfo) => void;
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
  deleteWorkLogsByProjectId: (projectId: string) => void;
}

export interface WorkTasksContextType {
  workTasks: WorkTask[];
  addWorkTask: (workTask: Omit<WorkTask, 'id' | 'createdAt'>) => WorkTask;
  updateWorkTask: (workTask: WorkTask) => void;
  deleteWorkTask: (id: string) => void;
}

export interface TeamsContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  getTeamById: (id: string) => Team | undefined;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addPersonnel: (name: string, position?: string) => void;
  updatePersonnel: (id: string, name: string, position?: string) => void;
  togglePersonnelActive: (id: string) => void;
  deletePersonnel: (id: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addCustomTask: (taskName: string) => CustomTask;
  updateCustomTask: (id: string, name: string) => void;
  deleteCustomTask: (id: string) => void;
  getCustomTasks: () => CustomTask[];
  getPersonnel: () => Personnel[];
}

export interface AuthContextType {
  auth: {
    currentUser: User | null;
    isAuthenticated: boolean;
  };
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => User | null;
  updateUser: (updatedUser: User) => void;
  deleteUser: (id: string) => void;
  getCurrentUser: () => User | null;
  canUserAccess: (requiredRole: UserRole) => boolean;
}
