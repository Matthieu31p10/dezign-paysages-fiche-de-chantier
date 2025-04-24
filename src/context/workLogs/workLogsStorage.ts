
import { WorkLog } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { toast } from 'sonner';

/**
 * Load workLogs from database
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    // Fetch work logs from database using Prisma
    console.log("Loading work logs from the database");
    
    // Uncomment this when database is properly connected
    // const workLogs = await prisma.workLog.findMany({
    //   include: {
    //     consumables: true
    //   }
    // });
    
    // For now, return an empty array until database is connected
    // This should be replaced with actual database calls
    return [];
  } catch (error) {
    console.error('Error loading work logs:', error);
    toast.error('Erreur lors du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Save workLogs to database
 */
export const saveWorkLogsToStorage = async (workLogs: WorkLog[]): Promise<void> => {
  try {
    console.log("Saving work logs to the database:", workLogs);
    
    // Uncomment this when database is properly connected
    // Each work log should be saved using prisma.workLog.upsert
    // for (const workLog of workLogs) {
    //   await prisma.workLog.upsert({
    //     where: { id: workLog.id },
    //     update: {
    //       date: new Date(workLog.date),
    //       projectId: workLog.projectId,
    //       personnel: workLog.personnel,
    //       departure: workLog.timeTracking?.departure || null,
    //       arrival: workLog.timeTracking?.arrival || null,
    //       end: workLog.timeTracking?.end || null,
    //       breakTime: workLog.timeTracking?.breakTime || null,
    //       totalHours: workLog.timeTracking?.totalHours || 0,
    //       tasks: workLog.tasks || null,
    //       wasteManagement: workLog.wasteManagement || null,
    //       notes: workLog.notes || null,
    //       clientSignature: workLog.clientSignature || null,
    //       invoiced: workLog.invoiced || false,
    //       isArchived: workLog.isArchived || false,
    //       hourlyRate: workLog.hourlyRate || null,
    //       clientName: workLog.clientName || null,
    //       address: workLog.address || null,
    //       contactPhone: workLog.contactPhone || null,
    //       contactEmail: workLog.contactEmail || null,
    //       linkedProjectId: workLog.linkedProjectId || null,
    //       signedQuoteAmount: workLog.signedQuoteAmount || null,
    //       isQuoteSigned: workLog.isQuoteSigned || false,
    //       // Gérer les consommables séparément
    //     },
    //     create: {
    //       id: workLog.id,
    //       date: new Date(workLog.date),
    //       projectId: workLog.projectId,
    //       personnel: workLog.personnel,
    //       departure: workLog.timeTracking?.departure || null,
    //       arrival: workLog.timeTracking?.arrival || null,
    //       end: workLog.timeTracking?.end || null,
    //       breakTime: workLog.timeTracking?.breakTime || null,
    //       totalHours: workLog.timeTracking?.totalHours || 0,
    //       tasks: workLog.tasks || null,
    //       wasteManagement: workLog.wasteManagement || null,
    //       notes: workLog.notes || null,
    //       clientSignature: workLog.clientSignature || null,
    //       invoiced: workLog.invoiced || false,
    //       isArchived: workLog.isArchived || false,
    //       hourlyRate: workLog.hourlyRate || null,
    //       clientName: workLog.clientName || null,
    //       address: workLog.address || null,
    //       contactPhone: workLog.contactPhone || null,
    //       contactEmail: workLog.contactEmail || null,
    //       linkedProjectId: workLog.linkedProjectId || null,
    //       signedQuoteAmount: workLog.signedQuoteAmount || null,
    //       isQuoteSigned: workLog.isQuoteSigned || false,
    //     }
    //   });
    //
    //   // Handle consumables
    //   if (workLog.consumables && workLog.consumables.length > 0) {
    //     // First delete existing consumables to avoid duplicates
    //     await prisma.consumable.deleteMany({
    //       where: { workLogId: workLog.id }
    //     });
    //
    //     // Then create new consumables
    //     for (const consumable of workLog.consumables) {
    //       await prisma.consumable.create({
    //         data: {
    //           id: consumable.id,
    //           supplier: consumable.supplier,
    //           product: consumable.product,
    //           unit: consumable.unit,
    //           quantity: consumable.quantity,
    //           unitPrice: consumable.unitPrice,
    //           totalPrice: consumable.totalPrice,
    //           workLogId: workLog.id
    //         }
    //       });
    //     }
    //   }
    // }
    
  } catch (error) {
    console.error('Error saving work logs:', error);
    toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
  }
};

/**
 * Load saved consumables from database
 */
export const loadSavedConsumables = async () => {
  try {
    console.log("Loading saved consumables from the database");
    
    // Uncomment this when database is properly connected
    // const savedConsumables = await prisma.consumable.findMany({
    //   where: { savedForReuse: true }
    // });
    //
    // return savedConsumables;
    
    // For now, return an empty array
    return [];
  } catch (error) {
    console.error('Error loading saved consumables:', error);
    toast.error('Erreur lors du chargement des consommables');
    return [];
  }
};

/**
 * Save a consumable for reuse
 */
export const saveConsumableForReuse = async (consumable: any) => {
  try {
    console.log("Saving consumable for reuse:", consumable);
    
    // Uncomment this when database is properly connected
    // await prisma.consumable.create({
    //   data: {
    //     id: consumable.id || crypto.randomUUID(),
    //     supplier: consumable.supplier,
    //     product: consumable.product,
    //     unit: consumable.unit,
    //     quantity: consumable.quantity,
    //     unitPrice: consumable.unitPrice,
    //     totalPrice: consumable.totalPrice,
    //     savedForReuse: true
    //   }
    // });
    
  } catch (error) {
    console.error('Error saving consumable for reuse:', error);
    toast.error('Erreur lors de l\'enregistrement du consommable');
  }
};
