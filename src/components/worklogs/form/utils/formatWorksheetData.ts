
import { FormValues } from '../schema';
import { Consumable, WorkLog } from '@/types/models';

/**
 * Assure qu'une valeur est convertie en nombre
 */
const ensureNumber = (value: any, defaultValue = 0): number => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

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
  const duration = ensureNumber(data.duration, 0);
  const totalHours = ensureNumber(data.totalHours, 0);
  const waterConsumption = ensureNumber(data.waterConsumption, 0);
  
  // Verify that projectId is not undefined
  if (!data.projectId) {
    console.warn('ProjectId is missing in form data. Using a default value.');
  }
  
  // Assurer que les tableaux et objets ne sont jamais undefined
  const personnel = Array.isArray(data.personnel) ? data.personnel : [];
  const customTasks = data.customTasks || {};
  const tasksProgress = data.tasksProgress || {};
  
  return {
    id,
    projectId: data.projectId || 'default-project',
    date: data.date.toISOString(),
    personnel,
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
    notes: notes || '',
    consumables: consumables.map(c => ({
      ...c,
      quantity: ensureNumber(c.quantity),
      unitPrice: ensureNumber(c.unitPrice),
      totalPrice: ensureNumber(c.totalPrice)
    })),
    invoiced: data.invoiced || false,
    tasksPerformed: {
      watering: data.watering || 'none',
      customTasks,
      tasksProgress
    }
  };
};
