import { Team, WorkLog, ProjectInfo } from '@/types/models';

/**
 * Safely normalize a string for comparison (handles null/undefined)
 */
const normalizeString = (str: string | null | undefined): string => {
  return (str || '').toLowerCase().trim();
};

/**
 * Check if a team matches a filter criteria
 */
export const isTeamMatch = (team: Team | null | undefined, filter: string): boolean => {
  if (!team || !filter || filter === 'all') return true;
  
  const normalizedFilter = normalizeString(filter);
  const normalizedTeamName = normalizeString(team.name);
  const normalizedTeamId = normalizeString(team.id);
  
  return normalizedTeamName === normalizedFilter || 
         normalizedTeamId === normalizedFilter ||
         normalizedTeamName.includes(normalizedFilter);
};

/**
 * Check if personnel array contains team members
 */
export const isPersonnelInTeam = (
  personnel: string[] | null | undefined, 
  teamFilter: string,
  teams: Team[]
): boolean => {
  if (!personnel || !teamFilter || teamFilter === 'all') return true;
  
  const normalizedFilter = normalizeString(teamFilter);
  
  // Direct personnel name match
  const hasPersonnelMatch = personnel.some(person => 
    normalizeString(person).includes(normalizedFilter)
  );
  
  if (hasPersonnelMatch) return true;
  
  // Team name match
  const matchingTeam = teams.find(team => 
    normalizeString(team.name) === normalizedFilter ||
    normalizeString(team.id) === normalizedFilter
  );
  
  if (!matchingTeam) return false;
  
  // Check if any personnel belongs to the matching team
  return personnel.some(person => 
    normalizeString(person).includes(normalizeString(matchingTeam.name))
  );
};

/**
 * Filter projects by team assignment
 */
export const filterProjectsByTeam = (
  projects: ProjectInfo[],
  teamFilter: string,
  teams: Team[]
): ProjectInfo[] => {
  if (!teamFilter || teamFilter === 'all') return projects;
  
  return projects.filter(project => {
    if (!project.team) return false;
    
    const projectTeam = teams.find(team => team.id === project.team);
    return isTeamMatch(projectTeam, teamFilter);
  });
};

/**
 * Filter work logs by team assignment
 */
export const filterWorkLogsByTeam = (
  workLogs: WorkLog[],
  teamFilter: string,
  teams: Team[]
): WorkLog[] => {
  if (!teamFilter || teamFilter === 'all') return workLogs;
  
  return workLogs.filter(log => 
    isPersonnelInTeam(log.personnel, teamFilter, teams)
  );
};

/**
 * Get team by ID with null safety
 */
export const getTeamById = (teams: Team[], teamId: string | null | undefined): Team | null => {
  if (!teamId || !teams) return null;
  return teams.find(team => team.id === teamId) || null;
};

/**
 * Get team by name with null safety
 */
export const getTeamByName = (teams: Team[], teamName: string | null | undefined): Team | null => {
  if (!teamName || !teams) return null;
  return teams.find(team => normalizeString(team.name) === normalizeString(teamName)) || null;
};