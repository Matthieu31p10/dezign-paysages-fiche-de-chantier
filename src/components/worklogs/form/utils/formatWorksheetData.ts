
import { FormValues } from '../schema';
import { WorkLog, Consumable } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

export const createWorkLogFromFormData = (
  formData: FormValues,
  existingWorkLogId: string | null | undefined,
  workLogs: WorkLog[],
  structuredNotes: string,
  validatedConsumables: Consumable[],
  currentUserName?: string
): WorkLog => {
  const id = existingWorkLogId || uuidv4();
  
  // Calculate total hours if not provided
  let totalHours = formData.totalHours || 0;
  if (formData.departure && formData.arrival && formData.end) {
    const departure = new Date(`1970-01-01T${formData.departure}:00`);
    const arrival = new Date(`1970-01-01T${formData.arrival}:00`);
    const end = new Date(`1970-01-01T${formData.end}:00`);
    const breakTime = formData.breakTime ? parseFloat(formData.breakTime) : 0;
    
    const workTimeMs = end.getTime() - arrival.getTime();
    const workTimeHours = workTimeMs / (1000 * 60 * 60);
    totalHours = Math.max(0, workTimeHours - breakTime);
  }

  return {
    id,
    projectId: formData.projectId || '',
    date: formData.date.toISOString().split('T')[0],
    personnel: formData.personnel || [],
    timeTracking: {
      departure: formData.departure,
      arrival: formData.arrival,
      end: formData.end,
      breakTime: formData.breakTime,
      totalHours: totalHours
    },
    duration: formData.duration,
    waterConsumption: formData.waterConsumption,
    wasteManagement: formData.wasteManagement || 'none',
    tasks: '',
    notes: structuredNotes,
    consumables: validatedConsumables,
    invoiced: formData.invoiced || false,
    isArchived: false,
    tasksPerformed: {
      watering: formData.watering || 'none',
      customTasks: formData.customTasks || {},
      tasksProgress: formData.tasksProgress || {}
    },
    clientName: formData.clientName,
    address: formData.address,
    contactPhone: formData.contactPhone,
    contactEmail: formData.contactEmail,
    hourlyRate: formData.hourlyRate,
    signedQuoteAmount: formData.signedQuoteAmount,
    isQuoteSigned: formData.isQuoteSigned,
    linkedProjectId: formData.linkedProjectId,
    isBlankWorksheet: false,
    createdAt: new Date(),
    createdBy: currentUserName
  };
};

export const formatStructuredNotes = (formData: any): string => {
  const sections: string[] = [];
  
  if (formData.notes && formData.notes.trim()) {
    sections.push(`Notes: ${formData.notes.trim()}`);
  }
  
  return sections.join('\n\n');
};

export const validateConsumables = (consumables: any[] = []): Consumable[] => {
  return consumables
    .filter(consumable => 
      consumable && 
      consumable.product && 
      consumable.product.trim() !== '' &&
      consumable.quantity > 0
    )
    .map(consumable => ({
      id: consumable.id || uuidv4(),
      supplier: consumable.supplier || '',
      product: consumable.product,
      unit: consumable.unit || 'unité',
      quantity: Number(consumable.quantity) || 0,
      unitPrice: Number(consumable.unitPrice) || 0,
      totalPrice: Number(consumable.totalPrice) || 0
    }));
};
