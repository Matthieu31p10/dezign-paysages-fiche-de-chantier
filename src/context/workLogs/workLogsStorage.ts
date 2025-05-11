import { WorkLog, Consumable } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { toast } from 'sonner';

// Mock storage for browser environment
let localWorkLogs: WorkLog[] = [];
let localConsumables: Consumable[] = [];

const isBrowser = typeof window !== 'undefined';

/**
 * Load workLogs from database or local storage
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    console.log("Loading work logs");
    
    if (isBrowser) {
      // Browser: try to load from localStorage
      const storedWorkLogs = localStorage.getItem('workLogs');
      if (storedWorkLogs) {
        localWorkLogs = JSON.parse(storedWorkLogs).map((log: any) => ({
          ...log,
          createdAt: new Date(log.createdAt)
        }));
      }
      return localWorkLogs;
    }
    
    // Server: use Prisma
    const workLogs = await prisma.workLog.findMany({
      include: {
        consumables: true
      }
    });
    
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
  } catch (error) {
    console.error('Error loading work logs:', error);
    toast.error('Erreur lors du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Save workLogs to database or local storage
 */
export const saveWorkLogsToStorage = async (workLogs: WorkLog[]): Promise<void> => {
  try {
    console.log("Saving work logs:", workLogs);
    
    if (isBrowser) {
      // Browser: save to localStorage
      localWorkLogs = workLogs;
      localStorage.setItem('workLogs', JSON.stringify(workLogs));
      return;
    }
    
    // In a Node.js environment, we would implement database operations here
    // For now we'll just log this as it would require transactions
    console.log("In server environment, would save workLogs to database:", workLogs);
  } catch (error) {
    console.error('Error saving work logs:', error);
    toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
  }
};

/**
 * Add a single workLog to the database or local storage
 */
export const addWorkLogToDatabase = async (workLog: WorkLog): Promise<WorkLog> => {
  try {
    console.log("Adding work log:", workLog);
    
    if (isBrowser) {
      // Browser: add to local array and save to localStorage
      const newWorkLog = {
        ...workLog,
        createdAt: new Date()
      };
      localWorkLogs.push(newWorkLog);
      localStorage.setItem('workLogs', JSON.stringify(localWorkLogs));
      return newWorkLog;
    }
    
    // Extract consumables to create them separately
    const consumables = workLog.consumables || [];
    
    // Create the work log without consumables first
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
        vatRate: workLog.vatRate,
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
  } catch (error) {
    console.error('Error adding work log:', error);
    toast.error('Erreur lors de l\'ajout de la fiche de suivi');
    throw error;
  }
};

/**
 * Update a single workLog in the database or local storage
 */
export const updateWorkLogInDatabase = async (workLog: WorkLog): Promise<WorkLog> => {
  try {
    console.log("Updating work log:", workLog);
    
    if (isBrowser) {
      // Browser: update local array and save to localStorage
      const index = localWorkLogs.findIndex(log => log.id === workLog.id);
      if (index !== -1) {
        localWorkLogs[index] = {
          ...workLog,
          createdAt: workLog.createdAt instanceof Date ? workLog.createdAt : new Date(workLog.createdAt)
        };
        localStorage.setItem('workLogs', JSON.stringify(localWorkLogs));
      }
      return workLog;
    }
    
    // Server: use Prisma
    // ... keep existing code (server-side update operations using Prisma)
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
        vatRate: workLog.vatRate,
        isBlankWorksheet: workLog.isBlankWorksheet || false
      },
    });
    
    // ... keep existing code (handling consumables and returning the updated work log)
    // Delete all existing consumables for this work log
    await prisma.consumable.deleteMany({
      where: { workLogId: workLog.id }
    });
    
    const consumables = workLog.consumables || [];
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
  } catch (error) {
    console.error('Error updating work log:', error);
    toast.error('Erreur lors de la mise à jour de la fiche de suivi');
    throw error;
  }
};

/**
 * Load saved consumables from database or local storage
 */
export const loadSavedConsumables = async (): Promise<Consumable[]> => {
  try {
    console.log("Loading saved consumables");
    
    if (isBrowser) {
      // Browser: load from localStorage
      const storedConsumables = localStorage.getItem('savedConsumables');
      if (storedConsumables) {
        localConsumables = JSON.parse(storedConsumables);
      }
      return localConsumables;
    }
    
    // Server: use Prisma
    const savedConsumables = await prisma.consumable.findMany({
      where: { savedForReuse: true }
    });
    
    return savedConsumables;
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
    
    if (isBrowser) {
      // Browser: add to local array and save to localStorage
      const newConsumable = {
        ...consumable,
        id: consumable.id || crypto.randomUUID()
      };
      localConsumables.push(newConsumable);
      localStorage.setItem('savedConsumables', JSON.stringify(localConsumables));
      return;
    }
    
    // Server: use Prisma
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
    
  } catch (error) {
    console.error('Error saving consumable for reuse:', error);
    toast.error('Erreur lors de l\'enregistrement du consommable');
  }
};
