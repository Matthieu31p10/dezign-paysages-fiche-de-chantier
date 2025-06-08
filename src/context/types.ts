
import { ProjectInfo, WorkLog, Team, AppSettings, User, UserRole, AuthState, Personnel, CustomTask } from '@/types/models';

export interface ProjectsContextType {
  projectInfos: ProjectInfo[];
  selectedProjectId: string | null;
  isLoading?: boolean;
  addProjectInfo: (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => Promise<ProjectInfo>;
  updateProjectInfo: (projectInfo: ProjectInfo) => Promise<void>;
  deleteProjectInfo: (id: string) => Promise<void>;
  selectProject: (id: string | null) => void;
  getProjectById: (id: string) => ProjectInfo | undefined;
  getActiveProjects: () => ProjectInfo[];
  getArchivedProjects: () => ProjectInfo[];
}

export type WorkLogsContextType = {
  workLogs: WorkLog[];
  isLoading: boolean;
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => Promise<void>;
  deleteWorkLog: (id: string) => void;
  deleteWorkLogsByProjectId: (projectId: string) => void;
  archiveWorkLogsByProjectId: (projectId: string, archived: boolean) => void;
  getWorkLogById: (id: string) => WorkLog | undefined;
  getWorkLogsByProjectId: (projectId: string) => WorkLog[];
  getTotalDuration: (projectId: string) => number;
  getTotalVisits: (projectId: string) => number;
  getLastVisitDate: (projectId: string) => Date | null;
};

export interface TeamsContextType {
  teams: Team[];
  isLoading?: boolean;
  addTeam: (team: Omit<Team, 'id'>) => Promise<Team>;
  updateTeam: (team: Team) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  addCustomTask: (taskName: string) => Promise<CustomTask>;
  deleteCustomTask: (id: string) => Promise<void>;
  addPersonnel: (name: string, position?: string) => Promise<Personnel>;
  updatePersonnel: (personnel: Personnel) => Promise<void>;
  deletePersonnel: (id: string) => Promise<void>;
  getPersonnel: () => Personnel[];
  togglePersonnelActive: (id: string, isActive: boolean) => Promise<void>;
  getCustomTasks: () => CustomTask[];
  users?: User[];
  updateUserPermissions?: (userId: string, permissions: Record<string, boolean>) => void;
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
  users?: User[];
  updateUserPermissions?: (userId: string, permissions: Record<string, boolean>) => void;
}
