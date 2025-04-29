
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
  const duration = typeof data.duration === 'string' ? parseFloat(data.duration) || 0 : (data.duration || 0);
  const totalHours = typeof data.totalHours === 'string' ? parseFloat(data.totalHours) || 0 : (data.totalHours || 0);
  const waterConsumption = typeof data.waterConsumption === 'string' ? parseFloat(data.waterConsumption) || 0 : (data.waterConsumption || 0);
  
  return {
    id,
    projectId: data.projectId || '',
    date: data.date instanceof Date ? data.date.toISOString() : new Date().toISOString(),
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
    wasteManagement: data.wasteManagement || 'none',
    notes,
    consumables,
    invoiced: data.invoiced || false,
    tasksPerformed: {
      watering: data.watering || 'none',
      customTasks: data.customTasks || {},
      tasksProgress: data.tasksProgress || {}
    },
    createdAt: new Date() // Assurez-vous que createdAt est inclus et est un objet Date
  };
};
