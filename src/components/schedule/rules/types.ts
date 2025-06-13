
export interface ProjectRule {
  projectId: string;
  fixedDays: Record<string, boolean>;
  distributionStrategy: 'even' | 'start' | 'end';
  maxConsecutiveDays: number;
}

export interface DayOption {
  id: string;
  label: string;
}
