
export interface LastVisitInfo {
  projectId: string;
  projectName: string;
  lastVisitDate: Date | null;
  daysSinceLastVisit: number | null;
  address: string;
}

export interface TeamLastVisitsProps {
  teamId: string;
  teamName: string;
  projects: any[];
}
