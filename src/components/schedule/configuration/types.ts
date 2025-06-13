
export interface SchedulingRule {
  id: string;
  projectId: string;
  intervalType: 'days' | 'weeks' | 'months';
  intervalValue: number;
  startDate?: string;
  endDate?: string;
  skipWeekends: boolean;
  skipHolidays: boolean;
  preferredDays: string[];
  preferredTimes: string[];
  notes: string;
  priority: 'low' | 'medium' | 'high';
  autoAdjust: boolean;
}

export interface DayOption {
  value: string;
  label: string;
}

export interface TimeSlot {
  value: string;
  label: string;
}
