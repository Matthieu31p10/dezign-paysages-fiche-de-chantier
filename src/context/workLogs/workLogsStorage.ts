
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

      // Convertir les données de la BD vers notre format d'application
      return workLogs.map(log => ({
        id: log.id,
        projectId: log.projectId,
        date: log.date.toISOString(),
        personnel: log.personnel,
        timeTracking: {
          departure: log.departure || '',
          arrival: log.arrival || '',
          end: log.end || '',
          breakTime: log.breakTime || '',
          totalHours: log.totalHours
        },
        duration: log.totalHours, // Pour compatibilité
        waterConsumption: log.waterConsumption || 0,
        wasteManagement: log.wasteManagement,
        notes: log.notes || '',
        consumables: log.consumables.map(c => ({
          id: c.id,
          supplier: c.supplier,
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          totalPrice: c.totalPrice
        })),
        invoiced: log.invoiced,
        isArchived: log.isArchived,
        tasksPerformed: {
          watering: (log.watering as 'none' | 'on' | 'off') || 'none',
          customTasks: (log.customTasks as Record<string, boolean>) || {},
          tasksProgress: (log.tasksProgress as Record<string, number>) || {}
        },
        clientName: log.clientName,
        isBlankWorksheet: log.isBlankWorksheet || false
      }));
    } catch (dbError) {
      console.error('Erreur de base de données:', dbError);
      toast.error('Connexion à la base de données impossible. Utilisation du mode local.');
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
    
    try {
      // Pour chaque worklog, création ou mise à jour
      for (const workLog of workLogs) {
        // Préparer les données pour la base de données
        const worklogData = {
          projectId: workLog.projectId,
          date: new Date(workLog.date),
          personnel: workLog.personnel,
          departure: workLog.timeTracking?.departure,
          arrival: workLog.timeTracking?.arrival,
          end: workLog.timeTracking?.end,
          breakTime: workLog.timeTracking?.breakTime,
          totalHours: workLog.timeTracking?.totalHours || 0,
          notes: workLog.notes,
          waterConsumption: workLog.waterConsumption,
          invoiced: workLog.invoiced || false,
          isArchived: workLog.isArchived || false,
          watering: workLog.tasksPerformed?.watering || 'none',
          customTasks: workLog.tasksPerformed?.customTasks || {},
          tasksProgress: workLog.tasksPerformed?.tasksProgress || {},
          wasteManagement: workLog.wasteManagement || 'none',
          clientName: workLog.clientName,
          isBlankWorksheet: workLog.isBlankWorksheet || false
        };

        // Utiliser upsert pour créer ou mettre à jour
        await prisma.workLog.upsert({
          where: { id: workLog.id },
          update: worklogData,
          create: {
            id: workLog.id,
            ...worklogData,
          }
        });

        // Gérer les consommables
        if (workLog.consumables && workLog.consumables.length > 0) {
          // Supprimer les anciens consommables pour éviter les doublons
          await prisma.consumable.deleteMany({
            where: { workLogId: workLog.id }
          });

          // Ajouter les nouveaux consommables
          for (const consumable of workLog.consumables) {
            await prisma.consumable.create({
              data: {
                id: consumable.id,
                supplier: consumable.supplier,
                product: consumable.product,
                unit: consumable.unit,
                quantity: consumable.quantity,
                unitPrice: consumable.unitPrice,
                totalPrice: consumable.totalPrice,
                workLogId: workLog.id,
                savedForReuse: false
              }
            });
          }
        }
      }
    } catch (dbError) {
      console.error('Erreur de base de données lors de la sauvegarde:', dbError);
      toast.error('Impossible de sauvegarder dans la base de données. Mode local activé.');
    }
  } catch (error) {
    console.error('Error saving work logs:', error);
    toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
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
      
      return savedConsumables.map(c => ({
        id: c.id,
        supplier: c.supplier,
        product: c.product,
        unit: c.unit,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        totalPrice: c.totalPrice
      }));
    } catch (dbError) {
      console.error('Erreur de base de données lors du chargement des consommables:', dbError);
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
      
      toast.success('Consommable enregistré pour réutilisation');
    } catch (dbError) {
      console.error('Erreur lors de l\'enregistrement du consommable:', dbError);
      toast.error('Impossible d\'enregistrer le consommable dans la base de données');
    }
  } catch (error) {
    console.error('Error saving consumable for reuse:', error);
    toast.error('Erreur lors de l\'enregistrement du consommable');
  }
};
