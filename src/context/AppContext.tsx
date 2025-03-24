
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectInfo, WorkLog, Team, AppSettings } from '@/types/models';
import { toast } from 'sonner';

interface AppContextType {
  projectInfos: ProjectInfo[];
  workLogs: WorkLog[];
  teams: Team[];
  settings: AppSettings;
  selectedProjectId: string | null;
  addProjectInfo: (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => ProjectInfo;
  updateProjectInfo: (projectInfo: ProjectInfo) => void;
  deleteProjectInfo: (id: string) => void;
  addWorkLog: (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => WorkLog;
  updateWorkLog: (workLog: WorkLog) => void;
  deleteWorkLog: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  selectProject: (id: string | null) => void;
  getProjectById: (id: string) => ProjectInfo | undefined;
  getWorkLogsByProjectId: (projectId: string) => WorkLog[];
  getActiveProjects: () => ProjectInfo[];
  getArchivedProjects: () => ProjectInfo[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage keys
const PROJECTS_STORAGE_KEY = 'landscaping-projects';
const WORKLOGS_STORAGE_KEY = 'landscaping-worklogs';
const TEAMS_STORAGE_KEY = 'landscaping-teams';
const SETTINGS_STORAGE_KEY = 'landscaping-settings';
const SELECTED_PROJECT_KEY = 'landscaping-selected-project';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectInfos, setProjectInfos] = useState<ProjectInfo[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [settings, setSettings] = useState<AppSettings>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
      const storedWorkLogs = localStorage.getItem(WORKLOGS_STORAGE_KEY);
      const storedTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const storedSelectedProject = localStorage.getItem(SELECTED_PROJECT_KEY);

      if (storedProjects) setProjectInfos(JSON.parse(storedProjects));
      if (storedWorkLogs) setWorkLogs(JSON.parse(storedWorkLogs));
      if (storedTeams) setTeams(JSON.parse(storedTeams));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedSelectedProject) setSelectedProjectId(storedSelectedProject);

      // Initialize with default team if none exists
      if (!storedTeams || JSON.parse(storedTeams).length === 0) {
        const defaultTeam = { id: crypto.randomUUID(), name: 'Équipe principale' };
        setTeams([defaultTeam]);
        localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify([defaultTeam]));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      toast.error('Erreur lors du chargement des données');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectInfos));
  }, [projectInfos]);

  useEffect(() => {
    localStorage.setItem(WORKLOGS_STORAGE_KEY, JSON.stringify(workLogs));
  }, [workLogs]);

  useEffect(() => {
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem(SELECTED_PROJECT_KEY, selectedProjectId);
    } else {
      localStorage.removeItem(SELECTED_PROJECT_KEY);
    }
  }, [selectedProjectId]);

  const addProjectInfo = (projectInfo: Omit<ProjectInfo, 'id' | 'createdAt'>) => {
    const newProjectInfo: ProjectInfo = {
      ...projectInfo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setProjectInfos((prev) => [...prev, newProjectInfo]);
    toast.success('Fiche chantier créée');
    return newProjectInfo;
  };

  const updateProjectInfo = (projectInfo: ProjectInfo) => {
    setProjectInfos((prev) =>
      prev.map((p) => (p.id === projectInfo.id ? projectInfo : p))
    );
    toast.success('Fiche chantier mise à jour');
  };

  const deleteProjectInfo = (id: string) => {
    setProjectInfos((prev) => prev.filter((p) => p.id !== id));
    
    // Also delete associated work logs
    setWorkLogs((prev) => prev.filter((w) => w.projectId !== id));
    
    toast.success('Fiche chantier supprimée');
    
    // If the deleted project was selected, clear selection
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const addWorkLog = (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => {
    const newWorkLog: WorkLog = {
      ...workLog,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setWorkLogs((prev) => [...prev, newWorkLog]);
    toast.success('Fiche de suivi ajoutée');
    return newWorkLog;
  };

  const updateWorkLog = (workLog: WorkLog) => {
    setWorkLogs((prev) =>
      prev.map((w) => (w.id === workLog.id ? workLog : w))
    );
    toast.success('Fiche de suivi mise à jour');
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs((prev) => prev.filter((w) => w.id !== id));
    toast.success('Fiche de suivi supprimée');
  };

  const addTeam = (team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: crypto.randomUUID(),
    };
    setTeams((prev) => [...prev, newTeam]);
    toast.success('Équipe ajoutée');
    return newTeam;
  };

  const updateTeam = (team: Team) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === team.id ? team : t))
    );
    toast.success('Équipe mise à jour');
  };

  const deleteTeam = (id: string) => {
    // Don't delete a team if it's assigned to any project
    const teamInUse = projectInfos.some(project => project.team === id);
    if (teamInUse) {
      toast.error('Impossible de supprimer l\'équipe car elle est assignée à un chantier');
      return;
    }
    
    setTeams((prev) => prev.filter((t) => t.id !== id));
    toast.success('Équipe supprimée');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    toast.success('Paramètres mis à jour');
  };

  const selectProject = (id: string | null) => {
    setSelectedProjectId(id);
  };

  const getProjectById = (id: string) => {
    return projectInfos.find((project) => project.id === id);
  };

  const getWorkLogsByProjectId = (projectId: string) => {
    return workLogs.filter((workLog) => workLog.projectId === projectId);
  };

  const getActiveProjects = () => {
    return projectInfos.filter(project => !project.isArchived);
  };

  const getArchivedProjects = () => {
    return projectInfos.filter(project => project.isArchived);
  };

  return (
    <AppContext.Provider
      value={{
        projectInfos,
        workLogs,
        teams,
        settings,
        selectedProjectId,
        addProjectInfo,
        updateProjectInfo,
        deleteProjectInfo,
        addWorkLog,
        updateWorkLog,
        deleteWorkLog,
        addTeam,
        updateTeam,
        deleteTeam,
        updateSettings,
        selectProject,
        getProjectById,
        getWorkLogsByProjectId,
        getActiveProjects,
        getArchivedProjects,
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
