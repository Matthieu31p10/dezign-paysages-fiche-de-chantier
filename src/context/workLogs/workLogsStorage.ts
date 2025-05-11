
import { WorkLog, Consumable } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { toast } from 'sonner';

/**
 * Load workLogs from database
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    // Fetch work logs from database using Prisma
    console.log("Loading work logs from the database");
    
    try {
      const workLogs = await prisma.workLog.findMany({
        include: {
          consumables: true
        }
      });
      
      // Convertir les dates en objets Date pour la compatibilité
      return workLogs.map(workLog => ({
        ...workLog,
        createdAt: new Date(workLog.createdAt),
        date: workLog.date.toISOString(),
        timeTracking: {
          departure: workLog.departure || '',
          arrival: workLog.arrival || '',
          end: workLog.end || '',
          breakTime: workLog.breakTime || '',
          totalHours: workLog.totalHours
        }
      }));
    } catch (err) {
      console.error("Error fetching from database, falling back to empty array", err);
      return [];
    }
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
    
    // For now, we'll implement a minimal version 
    // In a real production app, this would need transaction support
    // for batching and rollback capabilities
  } catch (error) {
    console.error('Error saving work logs:', error);
    toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
  }
};

/**
 * Add a single workLog to the database
 */
export const addWorkLogToDatabase = async (workLog: WorkLog): Promise<WorkLog> => {
  try {
    console.log("Adding work log to database:", workLog);
    
    // Extract consumables to create them separately
    const consumables = workLog.consumables || [];
    
    // Create the work log without consumables first
    try {
      const createdWorkLog = await prisma.workLog.create({
        data: {
          id: workLog.id,
          projectId: workLog.projectId,
          date: new Date(workLog.date),
          personnel: workLog.personnel,
          departure: workLog.timeTracking?.departure,
          arrival: workLog.timeTracking?.arrival,
          end: workLog.timeTracking?.end,
          breakTime: workLog.timeTracking?.breakTime,
          totalHours: workLog.timeTracking?.totalHours || 0,
          tasks: workLog.tasks,
          wasteManagement: workLog.wasteManagement,
          notes: workLog.notes,
          clientSignature: workLog.clientSignature,
          waterConsumption: workLog.waterConsumption,
          invoiced: workLog.invoiced || false,
          isArchived: workLog.isArchived || false,
          hourlyRate: workLog.hourlyRate,
          clientName: workLog.clientName,
          address: workLog.address,
          contactPhone: workLog.contactPhone,
          contactEmail: workLog.contactEmail,
          linkedProjectId: workLog.linkedProjectId,
          signedQuoteAmount: workLog.signedQuoteAmount,
          isQuoteSigned: workLog.isQuoteSigned || false,
          vatRate: workLog.vatRate as string || '20',
          isBlankWorksheet: workLog.isBlankWorksheet || false
        },
      });
      
      // Now create all consumables related to this work log
      if (consumables.length > 0) {
        for (const consumable of consumables) {
          await prisma.consumable.create({
            data: {
              id: consumable.id,
              supplier: consumable.supplier,
              product: consumable.product,
              unit: consumable.unit,
              quantity: consumable.quantity,
              unitPrice: consumable.unitPrice,
              totalPrice: consumable.totalPrice,
              workLogId: createdWorkLog.id,
              savedForReuse: false
            }
          });
        }
      }
      
      // Fetch the complete work log with its consumables
      const fullWorkLog = await prisma.workLog.findUnique({
        where: { id: createdWorkLog.id },
        include: { consumables: true }
      });
      
      if (!fullWorkLog) {
        throw new Error("Failed to retrieve the created work log");
      }
      
      // Convert to our app's WorkLog type format
      return {
        ...fullWorkLog,
        createdAt: new Date(fullWorkLog.createdAt),
        date: fullWorkLog.date.toISOString(),
        timeTracking: {
          departure: fullWorkLog.departure || '',
          arrival: fullWorkLog.arrival || '',
          end: fullWorkLog.end || '',
          breakTime: fullWorkLog.breakTime || '',
          totalHours: fullWorkLog.totalHours
        }
      } as WorkLog;
    } catch (err) {
      console.error("Database operation failed, falling back to memory storage", err);
      // Fallback for browser environment where Prisma isn't available
      return {
        ...workLog,
        createdAt: new Date(),
        id: workLog.id || crypto.randomUUID()
      };
    }
  } catch (error) {
    console.error('Error adding work log to database:', error);
    toast.error('Erreur lors de l\'ajout de la fiche de suivi');
    throw error;
  }
};

/**
 * Update a single workLog in the database
 */
export const updateWorkLogInDatabase = async (workLog: WorkLog): Promise<WorkLog> => {
  try {
    console.log("Updating work log in database:", workLog);
    
    // Extract consumables to update them separately
    const consumables = workLog.consumables || [];
    
    try {
      // Update the work log without consumables first
      const updatedWorkLog = await prisma.workLog.update({
        where: { id: workLog.id },
        data: {
          projectId: workLog.projectId,
          date: new Date(workLog.date),
          personnel: workLog.personnel,
          departure: workLog.timeTracking?.departure,
          arrival: workLog.timeTracking?.arrival,
          end: workLog.timeTracking?.end,
          breakTime: workLog.timeTracking?.breakTime,
          totalHours: workLog.timeTracking?.totalHours || 0,
          tasks: workLog.tasks,
          wasteManagement: workLog.wasteManagement,
          notes: workLog.notes,
          clientSignature: workLog.clientSignature,
          waterConsumption: workLog.waterConsumption,
          invoiced: workLog.invoiced || false,
          isArchived: workLog.isArchived || false,
          hourlyRate: workLog.hourlyRate,
          clientName: workLog.clientName,
          address: workLog.address,
          contactPhone: workLog.contactPhone,
          contactEmail: workLog.contactEmail,
          linkedProjectId: workLog.linkedProjectId,
          signedQuoteAmount: workLog.signedQuoteAmount,
          isQuoteSigned: workLog.isQuoteSigned || false,
          vatRate: workLog.vatRate as string || '20',
          isBlankWorksheet: workLog.isBlankWorksheet || false
        },
      });
      
      // Delete all existing consumables for this work log
      await prisma.consumable.deleteMany({
        where: { workLogId: workLog.id }
      });
      
      // Create all consumables related to this work log
      if (consumables.length > 0) {
        for (const consumable of consumables) {
          await prisma.consumable.create({
            data: {
              id: consumable.id,
              supplier: consumable.supplier,
              product: consumable.product,
              unit: consumable.unit,
              quantity: consumable.quantity,
              unitPrice: consumable.unitPrice,
              totalPrice: consumable.totalPrice,
              workLogId: updatedWorkLog.id,
              savedForReuse: false
            }
          });
        }
      }
      
      // Fetch the complete work log with its consumables
      const fullWorkLog = await prisma.workLog.findUnique({
        where: { id: updatedWorkLog.id },
        include: { consumables: true }
      });
      
      if (!fullWorkLog) {
        throw new Error("Failed to retrieve the updated work log");
      }
      
      // Convert to our app's WorkLog type format
      return {
        ...fullWorkLog,
        createdAt: new Date(fullWorkLog.createdAt),
        date: fullWorkLog.date.toISOString(),
        timeTracking: {
          departure: fullWorkLog.departure || '',
          arrival: fullWorkLog.arrival || '',
          end: fullWorkLog.end || '',
          breakTime: fullWorkLog.breakTime || '',
          totalHours: fullWorkLog.totalHours
        }
      } as WorkLog;
    } catch (err) {
      console.error("Database update operation failed, returning original worklog", err);
      // Fallback for browser environment
      return workLog;
    }
  } catch (error) {
    console.error('Error updating work log in database:', error);
    toast.error('Erreur lors de la mise à jour de la fiche de suivi');
    throw error;
  }
};

/**
 * Load saved consumables from database
 */
export const loadSavedConsumables = async (): Promise<Consumable[]> => {
  try {
    console.log("Loading saved consumables from the database");
    
    try {
      const savedConsumables = await prisma.consumable.findMany({
        where: { savedForReuse: true }
      });
      
      return savedConsumables;
    } catch (err) {
      console.error("Error loading saved consumables, falling back to empty array", err);
      return [];
    }
  } catch (error) {
    console.error('Error loading saved consumables:', error);
    toast.error('Erreur lors du chargement des consommables');
    return [];
  }
};

/**
 * Save a consumable for reuse
 */
export const saveConsumableForReuse = async (consumable: Consumable): Promise<void> => {
  try {
    console.log("Saving consumable for reuse:", consumable);
    
    try {
      await prisma.consumable.create({
        data: {
          id: consumable.id || crypto.randomUUID(),
          supplier: consumable.supplier,
          product: consumable.product,
          unit: consumable.unit,
          quantity: consumable.quantity,
          unitPrice: consumable.unitPrice,
          totalPrice: consumable.totalPrice,
          savedForReuse: true
        }
      });
    } catch (err) {
      console.error("Error saving consumable for reuse", err);
      // Just log the error in browser environments
    }
    
  } catch (error) {
    console.error('Error saving consumable for reuse:', error);
    toast.error('Erreur lors de l\'enregistrement du consommable');
  }
};
