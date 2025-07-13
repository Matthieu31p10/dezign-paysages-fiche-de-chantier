import { useProjects } from './ProjectsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useWorkLogs } from './WorkLogsContext/WorkLogsContext';
import { useAuth } from './AuthContext';

export const useApp = () => {
  const projectsContext = useProjects();
  const teamsContext = useTeams();
  const settingsContext = useSettings();
  const workLogsContext = useWorkLogs();
  const authContext = useAuth();

  return {
    // Projects
    projects: projectsContext.projectInfos,
    projectInfos: projectsContext.projectInfos,
    getProjectById: projectsContext.getProjectById,
    addProjectInfo: projectsContext.addProjectInfo,
    updateProjectInfo: projectsContext.updateProjectInfo,
    deleteProjectInfo: projectsContext.deleteProjectInfo,
    selectProject: projectsContext.selectProject,
    getActiveProjects: projectsContext.getActiveProjects,
    getArchivedProjects: projectsContext.getArchivedProjects,
    
    // Teams
    teams: teamsContext.teams,
    addTeam: teamsContext.addTeam,
    
    // Settings
    settings: settingsContext.settings,
    updateSettings: settingsContext.updateSettings,
    addCustomTask: settingsContext.addCustomTask,
    
    // Personnel from settings
    personnel: settingsContext.getPersonnel(),
    
    // Work logs
    workLogs: workLogsContext.workLogs,
    isLoading: workLogsContext.isLoading,
    addWorkLog: workLogsContext.addWorkLog,
    updateWorkLog: workLogsContext.updateWorkLog,
    deleteWorkLog: workLogsContext.deleteWorkLog,
    
    // Custom tasks
    customTasks: settingsContext.getCustomTasks(),
    
    // User management and permissions
    users: authContext.users,
    canUserAccess: authContext.canUserAccess,
    getCurrentUser: authContext.getCurrentUser,
    
    // Auth
    auth: authContext.auth,
    login: authContext.login,
    logout: authContext.logout,
    addUser: authContext.addUser,
    updateUser: authContext.updateUser,
    deleteUser: authContext.deleteUser,
  };
};