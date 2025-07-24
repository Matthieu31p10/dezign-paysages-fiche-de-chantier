import { ProjectInfo, Team } from '@/types/models';

/**
 * Get project name by ID with fallback
 */
export const getProjectName = (projects: ProjectInfo[], projectId: string): string => {
  const project = projects.find(p => p.id === projectId);
  return project?.name || 'Projet inconnu';
};

/**
 * Get project team name by project ID
 */
export const getProjectTeamName = (projects: ProjectInfo[], teams: Team[], projectId: string): string => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return 'Équipe inconnue';
  
  const team = teams.find(t => t.id === project.team);
  return team?.name || 'Équipe non assignée';
};

/**
 * Get project by ID
 */
export const getProjectById = (projects: ProjectInfo[], projectId: string): ProjectInfo | undefined => {
  return projects.find(p => p.id === projectId);
};

/**
 * Filter active (non-archived) projects
 */
export const getActiveProjects = (projects: ProjectInfo[]): ProjectInfo[] => {
  return projects.filter(p => !p.isArchived);
};

/**
 * Filter archived projects
 */
export const getArchivedProjects = (projects: ProjectInfo[]): ProjectInfo[] => {
  return projects.filter(p => p.isArchived);
};

/**
 * Get unique project types from projects list
 */
export const getProjectTypes = (projects: ProjectInfo[]): string[] => {
  const types = projects
    .map(project => project.projectType)
    .filter(type => type && type.trim() !== '');
  
  return [...new Set(types)];
};

/**
 * Filter projects by type
 */
export const filterProjectsByType = (projects: ProjectInfo[], type: string): ProjectInfo[] => {
  if (!type || type === 'all') return projects;
  return projects.filter(project => project.projectType === type);
};

/**
 * Get project team object
 */
export const getProjectTeam = (projects: ProjectInfo[], teams: Team[], projectId: string): Team | undefined => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return undefined;
  
  return teams.find(t => t.id === project.team);
};