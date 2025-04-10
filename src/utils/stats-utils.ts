
import { WorkLog } from '@/types/models';

// Statistics Calculations
export const calculateAverageHoursPerVisit = (
  totalHours: number, 
  totalVisits: number
): number => {
  if (totalVisits === 0) return 0;
  return totalHours / totalVisits;
};

// Water Consumption Stats
export const calculateWaterConsumption = (workLogs: WorkLog[]): number => {
  let totalConsumption = 0;
  
  workLogs.forEach(log => {
    if (log.waterConsumption && typeof log.waterConsumption === 'number') {
      totalConsumption += log.waterConsumption;
    }
  });
  
  return totalConsumption;
};
