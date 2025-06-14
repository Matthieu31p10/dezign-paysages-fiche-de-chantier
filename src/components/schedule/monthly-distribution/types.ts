
export type MonthlyRule = {
  projectId: string;
  monthlyVisits: Record<string, number>;
};

export interface MonthlyDistributionProps {
  projects: any[];
  teams: any[];
}
