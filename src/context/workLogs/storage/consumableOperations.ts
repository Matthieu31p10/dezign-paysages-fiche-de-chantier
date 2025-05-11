
import { Consumable } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { toast } from 'sonner';

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
