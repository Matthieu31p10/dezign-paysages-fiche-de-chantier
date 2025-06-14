
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { Consumable } from '@/types/models';
import { ConsumableFormState, EmptyConsumable } from '../types';
import { loadSavedConsumables } from '@/context/workLogs/consumableOperations';

export const useConsumablesState = () => {
  const { watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const [newConsumable, setNewConsumable] = useState<ConsumableFormState>({...EmptyConsumable});
  const [savedConsumablesDialogOpen, setSavedConsumablesDialogOpen] = useState(false);
  const [savedConsumables, setSavedConsumables] = useState<Consumable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const consumables = watch('consumables') || [];
  
  // Fetch saved consumables from the database
  useEffect(() => {
    const fetchSavedConsumables = async () => {
      try {
        setIsLoading(true);
        const data = await loadSavedConsumables();
        setSavedConsumables(data);
      } catch (error) {
        console.error("Error loading saved consumables:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch when dialog is opened
    if (savedConsumablesDialogOpen) {
      fetchSavedConsumables();
    }
  }, [savedConsumablesDialogOpen]);

  return {
    newConsumable,
    setNewConsumable,
    savedConsumablesDialogOpen,
    setSavedConsumablesDialogOpen,
    savedConsumables,
    setSavedConsumables,
    consumables,
    setValue,
    isLoading
  };
};
