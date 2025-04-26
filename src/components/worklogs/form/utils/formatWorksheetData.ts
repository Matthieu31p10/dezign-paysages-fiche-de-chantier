
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
      totalHours: data.totalHours || 0
    },
    duration: data.duration,
    waterConsumption: data.waterConsumption,
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
