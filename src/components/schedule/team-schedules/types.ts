
export interface TeamEvent {
  id: string;
  projectId: string;
  projectName: string;
  team: string;
  duration: number;
  address: string;
  passageNumber: number;
  totalPassages: number;
}

export interface TeamSchedulesProps {
  month: number;
  year: number;
  teamId: string;
  teams: { id: string; name: string }[];
  projects: {
    id: string;
    name: string;
    team: string;
    visitDuration: number;
    address: string;
    annualVisits?: number;
  }[];
}
