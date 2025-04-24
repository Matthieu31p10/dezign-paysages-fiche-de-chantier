
import { ProjectInfo, WorkLog, Team, AppSettings, User, UserRole, AuthState, Personnel, CustomTask } from '@/types/models';

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

export type WorkLogsContextType = {
  workLogs: WorkLog[];
  isLoading: boolean; // Add isLoading to the type
  addWorkLog: (workLog: WorkLog) => Promise<WorkLog>;
  updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => Promise<void>;
  deleteWorkLog: (id: string) => void;
  getWorkLogById: (id: string) => WorkLog | undefined;
  getWorkLogsByProjectId: (projectId: string) => WorkLog[];
  getTotalDuration: (projectId: string) => number;
  getTotalVisits: (projectId: string) => number;
  getLastVisitDate: (projectId: string) => Date | null;
};

export interface TeamsContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, 'id'>) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  addCustomTask: (taskName: string) => CustomTask;
  deleteCustomTask: (id: string) => void;
  addPersonnel: (name: string, position?: string) => Personnel;
  updatePersonnel: (personnel: Personnel) => void;
  deletePersonnel: (id: string) => void;
  getPersonnel: () => Personnel[];
  togglePersonnelActive: (id: string, isActive: boolean) => void;
  getCustomTasks: () => CustomTask[];
  users?: User[]; // Add users property
  updateUserPermissions?: (userId: string, permissions: Record<string, boolean>) => void; // Add updateUserPermissions method
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
  users?: User[]; // Add users property
  updateUserPermissions?: (userId: string, permissions: Record<string, boolean>) => void; // Add updateUserPermissions method
}
