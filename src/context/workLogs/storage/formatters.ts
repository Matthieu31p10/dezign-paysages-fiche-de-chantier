
import { WorkLog, Consumable } from '@/types/models';

/**
 * Format a database work log to application format
 */
export const formatWorkLogFromDatabase = (dbWorkLog: any, dbConsumables: any[] = []): WorkLog => {
  // Find consumables for this work log
  const logConsumables = dbConsumables
    .filter(c => c.work_log_id === dbWorkLog.id)
    .map(c => ({
      id: c.id,
      supplier: c.supplier,
      product: c.product,
      unit: c.unit,
      quantity: c.quantity,
      unitPrice: c.unit_price,
      totalPrice: c.total_price
    }));
  
  // Format the work log object with correct structure
  return {
    id: dbWorkLog.id,
    projectId: dbWorkLog.project_id || '', // Handle NULL project_id for blank worksheets
    date: dbWorkLog.date,
    personnel: dbWorkLog.personnel,
    timeTracking: {
      departure: dbWorkLog.departure,
      arrival: dbWorkLog.arrival,
      end: dbWorkLog.end_time,
      breakTime: dbWorkLog.break_time,
      totalHours: dbWorkLog.total_hours
    },
    waterConsumption: dbWorkLog.water_consumption,
    wasteManagement: dbWorkLog.waste_management,
    tasks: dbWorkLog.tasks,
    notes: dbWorkLog.notes,
    consumables: logConsumables,
    createdAt: new Date(dbWorkLog.created_at),
    invoiced: dbWorkLog.invoiced,
    isArchived: dbWorkLog.is_archived,
    clientSignature: dbWorkLog.client_signature,
    clientName: dbWorkLog.client_name,
    address: dbWorkLog.address,
    contactPhone: dbWorkLog.contact_phone,
    contactEmail: dbWorkLog.contact_email,
    hourlyRate: dbWorkLog.hourly_rate,
    linkedProjectId: dbWorkLog.linked_project_id,
    signedQuoteAmount: dbWorkLog.signed_quote_amount,
    isQuoteSigned: dbWorkLog.is_quote_signed,
    isBlankWorksheet: dbWorkLog.is_blank_worksheet,
    createdBy: dbWorkLog.created_by
  };
};

/**
 * Format a work log for database storage
 */
export const formatWorkLogForDatabase = (workLog: WorkLog) => {
  return {
    id: workLog.id,
    project_id: workLog.projectId || null, // NULL for blank worksheets
    date: workLog.date,
    personnel: workLog.personnel,
    departure: workLog.timeTracking?.departure,
    arrival: workLog.timeTracking?.arrival,
    end_time: workLog.timeTracking?.end,
    break_time: workLog.timeTracking?.breakTime,
    total_hours: workLog.timeTracking?.totalHours || 0,
    water_consumption: workLog.waterConsumption,
    waste_management: workLog.wasteManagement,
    tasks: workLog.tasks,
    notes: workLog.notes,
    invoiced: workLog.invoiced,
    is_archived: workLog.isArchived,
    client_signature: workLog.clientSignature,
    client_name: workLog.clientName,
    address: workLog.address,
    contact_phone: workLog.contactPhone,
    contact_email: workLog.contactEmail,
    hourly_rate: workLog.hourlyRate,
    linked_project_id: workLog.linkedProjectId || null,
    signed_quote_amount: workLog.signedQuoteAmount,
    is_quote_signed: workLog.isQuoteSigned,
    is_blank_worksheet: workLog.isBlankWorksheet,
    created_at: workLog.createdAt?.toISOString() || new Date().toISOString(),
    created_by: workLog.createdBy
  };
};

/**
 * Format consumables for database storage
 */
export const formatConsumablesForDatabase = (workLogId: string, consumables: Consumable[]) => {
  return consumables.map(c => ({
    id: c.id || crypto.randomUUID(),
    work_log_id: workLogId,
    supplier: c.supplier,
    product: c.product,
    unit: c.unit,
    quantity: c.quantity,
    unit_price: c.unitPrice,
    total_price: c.totalPrice,
    saved_for_reuse: false
  }));
};
