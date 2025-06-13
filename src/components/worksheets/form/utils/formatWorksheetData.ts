
import { BlankWorkSheetValues } from '../../schema';
import { WorkLog, Consumable } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

export const createWorkLogFromFormData = (
  formData: BlankWorkSheetValues,
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
    projectId: formData.linkedProjectId || `blank-${id}`,
    date: formData.date.toISOString().split('T')[0],
    personnel: formData.personnel || [],
    timeTracking: {
      departure: formData.departure,
      arrival: formData.arrival,
      end: formData.end,
      breakTime: formData.breakTime,
      totalHours: totalHours
    },
    duration: 0,
    waterConsumption: 0,
    wasteManagement: formData.wasteManagement || 'none',
    tasks: formData.tasks || '',
    notes: structuredNotes,
    consumables: validatedConsumables,
    invoiced: formData.invoiced || false,
    isArchived: false,
    tasksPerformed: {
      watering: 'none',
      customTasks: {},
      tasksProgress: {}
    },
    clientName: formData.clientName,
    address: formData.address,
    contactPhone: formData.contactPhone,
    contactEmail: formData.contactEmail,
    hourlyRate: formData.hourlyRate,
    signedQuoteAmount: formData.signedQuoteAmount,
    isQuoteSigned: formData.isQuoteSigned,
    linkedProjectId: formData.linkedProjectId,
    isBlankWorksheet: true,
    createdAt: new Date(),
    createdBy: currentUserName,
    clientSignature: formData.clientSignature
  };
};

export const formatStructuredNotes = (formData: BlankWorkSheetValues): string => {
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
