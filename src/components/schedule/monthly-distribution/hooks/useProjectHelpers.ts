
import { getProjectName, getProjectTeamName } from '@/utils/projectUtils';
import { ProjectInfo, Team } from '@/types/models';

export const useProjectHelpers = (projects: ProjectInfo[], teams: Team[]) => {
  return {
    getProjectName: (projectId: string) => getProjectName(projects, projectId),
    getProjectTeam: (projectId: string) => getProjectTeamName(projects, teams, projectId)
  };
};
