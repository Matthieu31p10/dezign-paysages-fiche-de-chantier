
import { useProjects } from './ProjectsContext';
import { useWorkLogs } from './WorkLogsContext';
import { useTeams } from './TeamsContext';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';

export const useApp = () => {
  const projects = useProjects();
  const workLogs = useWorkLogs();
  const teams = useTeams();
  const settings = useSettings();
  const auth = useAuth();

  return {
    // Projects context
    projectInfos: projects.projectInfos,
    selectedProjectId: projects.selectedProjectId,
    addProjectInfo: projects.addProjectInfo,
    updateProjectInfo: projects.updateProjectInfo,
    deleteProjectInfo: projects.deleteProjectInfo,
    selectProject: projects.selectProject,
    getProjectById: projects.getProjectById,
    getActiveProjects: projects.getActiveProjects,
    getArchivedProjects: projects.getArchivedProjects,
    
    // WorkLogs context
    workLogs: workLogs.workLogs,
    addWorkLog: workLogs.addWorkLog,
    updateWorkLog: workLogs.updateWorkLog,
    deleteWorkLog: workLogs.deleteWorkLog,
    getWorkLogsByProjectId: workLogs.getWorkLogsByProjectId,
    
    // Teams context
    teams: teams.teams,
    addTeam: teams.addTeam,
    updateTeam: teams.updateTeam,
    deleteTeam: teams.deleteTeam,
    
    // Settings context
    settings: settings.settings,
    updateSettings: settings.updateSettings,
    
    // Auth context
    auth: auth.auth,
    login: auth.login,
    logout: auth.logout,
    addUser: auth.addUser,
    updateUser: auth.updateUser,
    deleteUser: auth.deleteUser,
    getCurrentUser: auth.getCurrentUser,
    canUserAccess: auth.canUserAccess,
  };
};
