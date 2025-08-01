import { ProjectInfo, WorkLog, Team, AppSettings, User, UserRole, AuthState, Personnel, CustomTask, ClientConnection } from '@/types/models';
import { SupabaseSettings } from '@/hooks/useSupabaseSettings';

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
  deleteWorkLog: (id: string) => Promise<void>;
  deleteWorkLogsByProjectId: (projectId: string) => Promise<void>;
  archiveWorkLogsByProjectId: (projectId: string, archived: boolean) => Promise<void>;
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
  addClientConnection: (clientData: Omit<ClientConnection, 'id' | 'createdAt'>) => Promise<ClientConnection>;
  updateClientConnection: (client: ClientConnection) => Promise<void>;
  deleteClientConnection: (id: string) => Promise<void>;
  getClientConnections: () => ClientConnection[];
  // Supabase settings
  supabaseSettings: SupabaseSettings;
  saveSupabaseSettings: (settings: Partial<SupabaseSettings>) => Promise<SupabaseSettings>;
  updateSetting: (key: keyof SupabaseSettings, value: unknown) => Promise<void>;
  updateUserPreferences: (preferences: Record<string, unknown>) => Promise<void>;
  updateAppConfiguration: (config: Record<string, unknown>) => Promise<void>;
  updateNotificationPreferences: (preferences: Record<string, unknown>) => Promise<void>;
  supabaseLoading: boolean;
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
