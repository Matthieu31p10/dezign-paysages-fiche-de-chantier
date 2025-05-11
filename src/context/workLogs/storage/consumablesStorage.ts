
import { Consumable } from '@/types/models';
import prisma from '@/utils/prismaClient';
import { isBrowser, getLocalConsumables, setLocalConsumables, handleStorageError } from './storageUtils';

/**
 * Load saved consumables from database or local storage
 */
export const loadSavedConsumables = async (): Promise<Consumable[]> => {
  try {
    console.log("Loading saved consumables");
    
    if (isBrowser) {
      // Browser: load from localStorage
      try {
        const storedConsumables = localStorage.getItem('savedConsumables');
        if (storedConsumables) {
          const parsedConsumables = JSON.parse(storedConsumables);
          setLocalConsumables(parsedConsumables);
        }
        return getLocalConsumables();
      } catch (e) {
        console.error('Error loading consumables from localStorage:', e);
        return [];
      }
    }
    
    // Server: use Prisma
    try {
      const savedConsumables = await prisma.consumable.findMany({
        where: { savedForReuse: true }
      });
      
      return savedConsumables;
    } catch (e) {
      console.error('Error loading consumables from database:', e);
      return [];
    }
  } catch (error) {
    handleStorageError(error, 'du chargement des consommables');
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
      const updatedConsumables = [...getLocalConsumables(), newConsumable];
      setLocalConsumables(updatedConsumables);
      localStorage.setItem('savedConsumables', JSON.stringify(updatedConsumables));
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
    handleStorageError(error, 'de l\'enregistrement du consommable');
  }
};
