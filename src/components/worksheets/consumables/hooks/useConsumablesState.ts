
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { Consumable } from '@/types/models';
import { ConsumableFormState, EmptyConsumable } from '../types';

export const useConsumablesState = () => {
  const { watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const [newConsumable, setNewConsumable] = useState<ConsumableFormState>({...EmptyConsumable});
  const [savedConsumablesDialogOpen, setSavedConsumablesDialogOpen] = useState(false);
  const [savedConsumables, setSavedConsumables] = useState<Consumable[]>([]);
  
  const consumables = watch('consumables') || [];
  
  // In the future, we'll fetch saved consumables from the database here
  // This would be implemented with a React Query hook or similar

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
