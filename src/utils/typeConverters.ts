
import { BlankWorksheet } from '@/types/blankWorksheet';
import { WorkLog } from '@/types/models';

/**
 * Convertit un BlankWorksheet en format WorkLog pour la compatibilité
 */
export const convertBlankWorksheetToWorkLog = (worksheet: BlankWorksheet): WorkLog => {
  return {
    id: worksheet.id,
    projectId: worksheet.linked_project_id || '',
    date: worksheet.date,
    personnel: worksheet.personnel || [],
    timeTracking: {
      departure: worksheet.departure,
      arrival: worksheet.arrival,
      end: worksheet.end_time,
      breakTime: worksheet.break_time,
      totalHours: worksheet.total_hours
    },
    duration: worksheet.total_hours,
    waterConsumption: worksheet.water_consumption,
    wasteManagement: worksheet.waste_management,
    tasks: worksheet.tasks,
    notes: worksheet.notes,
    invoiced: worksheet.invoiced,
    isArchived: worksheet.is_archived,
    clientSignature: worksheet.client_signature,
    clientName: worksheet.client_name,
    address: worksheet.address,
    contactPhone: worksheet.contact_phone,
    contactEmail: worksheet.contact_email,
    hourlyRate: worksheet.hourly_rate,
    linkedProjectId: worksheet.linked_project_id,
    signedQuoteAmount: worksheet.signed_quote_amount,
    isQuoteSigned: worksheet.is_quote_signed,
    createdAt: worksheet.created_at,
    createdBy: worksheet.created_by,
    // Convertir les consumables au format WorkLog
    consumables: worksheet.consumables?.map(c => ({
      id: c.id,
      supplier: c.supplier,
      product: c.product,
      unit: c.unit,
      quantity: c.quantity,
      unitPrice: c.unit_price,
      totalPrice: c.total_price
    })) || []
  };
};

/**
 * Convertit plusieurs BlankWorksheets en format WorkLog
 */
export const convertBlankWorksheetsToWorkLogs = (worksheets: BlankWorksheet[]): WorkLog[] => {
  return worksheets.map(convertBlankWorksheetToWorkLog);
};
