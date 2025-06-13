
import React from 'react';
import { Team, ProjectInfo } from '@/types/models';
import TeamSchedules from './team-schedules/TeamSchedules';

interface TeamSchedulesProps {
  month: number;
  year: number;
  teamId: string;
  teams: Team[];
  projects: ProjectInfo[];
}

const TeamSchedulesWrapper: React.FC<TeamSchedulesProps> = (props) => {
  return <TeamSchedules {...props} />;
};

export default React.memo(TeamSchedulesWrapper);
