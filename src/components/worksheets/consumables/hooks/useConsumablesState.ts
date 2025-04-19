
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { Consumable } from '@/types/models';
import { ConsumableFormState, EmptyConsumable, SAVED_CONSUMABLES_KEY } from '../types';
import { toast } from 'sonner';

export const useConsumablesState = () => {
  const { watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const [newConsumable, setNewConsumable] = useState<ConsumableFormState>({...EmptyConsumable});
  const [savedConsumablesDialogOpen, setSavedConsumablesDialogOpen] = useState(false);
  const [savedConsumables, setSavedConsumables] = useState<Consumable[]>([]);
  
  const consumables = watch('consumables') || [];
  
  // Load saved consumables from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem(SAVED_CONSUMABLES_KEY);
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        const typedItems: Consumable[] = parsedItems.map((item: any): Consumable => ({
          supplier: item.supplier || '',
          product: item.product || '',
          unit: item.unit || '',
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          totalPrice: Number(item.totalPrice) || 0
        }));
        setSavedConsumables(typedItems);
      } catch (e) {
        console.error('Error loading saved consumables', e);
        localStorage.removeItem(SAVED_CONSUMABLES_KEY);
      }
    }
  }, []);

  return {
    newConsumable,
    setNewConsumable,
    savedConsumablesDialogOpen,
    setSavedConsumablesDialogOpen,
    savedConsumables,
    setSavedConsumables,
    consumables,
    setValue
  };
};
