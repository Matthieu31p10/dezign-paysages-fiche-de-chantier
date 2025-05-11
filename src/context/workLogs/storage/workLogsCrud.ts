
import { WorkLog } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { isBrowser, localWorkLogs, handleStorageError } from './storageUtils';
import crypto from 'crypto';

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
    handleStorageError(error, 'de l\'ajout de la fiche de suivi');
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
    handleStorageError(error, 'de la mise à jour de la fiche de suivi');
    throw error;
  }
};
