
import { FormValues } from '../schema';
import { Consumable, WorkLog } from '@/types/models';

/**
 * Creates a WorkLog object from form data
 */
export const createWorkLogFromFormData = (
  data: FormValues, 
  existingWorkLogId: string | null | undefined,
  workLogs: WorkLog[] = [],
  notes: string,
  consumables: Consumable[] = []
): WorkLog => {
  const id = existingWorkLogId || crypto.randomUUID();
  
  // Ensure numeric values are properly converted
  const duration = typeof data.duration === 'string' ? parseFloat(data.duration) || 0 : data.duration;
  const totalHours = typeof data.totalHours === 'string' ? parseFloat(data.totalHours) || 0 : data.totalHours || 0;
  const waterConsumption = typeof data.waterConsumption === 'string' ? parseFloat(data.waterConsumption) || 0 : data.waterConsumption;
  
  return {
    id,
    projectId: data.projectId || '',
    date: data.date.toISOString(),
    personnel: data.personnel || [],
    timeTracking: {
      departure: data.departure || '',
      arrival: data.arrival || '',
      end: data.end || '',
      breakTime: data.breakTime || '',
      totalHours
    },
    duration,
    waterConsumption,
    wasteManagement: data.wasteManagement,
    notes,
    consumables,
    invoiced: data.invoiced || false,
    tasksPerformed: {
      watering: data.watering,
      customTasks: data.customTasks,
      tasksProgress: data.tasksProgress
    }
  };
};
