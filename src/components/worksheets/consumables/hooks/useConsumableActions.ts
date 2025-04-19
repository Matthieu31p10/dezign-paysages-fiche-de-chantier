
import { ConsumableFormState, EmptyConsumable } from '../types';
import { Consumable } from '@/types/models';
import { toast } from 'sonner';
import { SAVED_CONSUMABLES_KEY } from '../types';

export const useConsumableActions = (
  newConsumable: ConsumableFormState,
  setNewConsumable: (consumable: ConsumableFormState) => void,
  consumables: Consumable[],
  setValue: (name: string, value: any) => void,
  savedConsumables: Consumable[],
  setSavedConsumables: (consumables: Consumable[]) => void,
) => {
  const updateNewConsumable = (field: keyof ConsumableFormState, value: string | number) => {
    setNewConsumable((prev: ConsumableFormState) => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }
      
      return updated;
    });
  };

  const handleAddConsumable = () => {
    if (newConsumable.quantity <= 0) {
      toast.error("La quantité doit être supérieure à 0");
      return;
    }

    const totalPrice = newConsumable.quantity * newConsumable.unitPrice;
    
    const consumableToAdd: Consumable = {
      supplier: newConsumable.supplier || '',
      product: newConsumable.product || '',
      unit: newConsumable.unit || '',
      quantity: Number(newConsumable.quantity) || 0,
      unitPrice: Number(newConsumable.unitPrice) || 0,
      totalPrice: Number(totalPrice) || 0
    };
    
    const typedConsumables: Consumable[] = Array.isArray(consumables) ? 
      consumables.map(item => ({
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      })) : [];
    
    const updatedConsumables: Consumable[] = [...typedConsumables, consumableToAdd];
    setValue('consumables', updatedConsumables);
    
    setNewConsumable({...EmptyConsumable});
  };

  const handleRemoveConsumable = (index: number) => {
    const typedConsumables: Consumable[] = Array.isArray(consumables) ? 
      consumables.map(item => ({
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      })) : [];
      
    const updatedConsumables = [...typedConsumables];
    updatedConsumables.splice(index, 1);
    setValue('consumables', updatedConsumables);
  };

  const handleSaveConsumables = () => {
    if (consumables.length === 0) {
      toast.error("Aucun consommable à sauvegarder");
      return;
    }
    
    const typedConsumables: Consumable[] = Array.isArray(consumables) ? 
      consumables.map(item => ({
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      })) : [];
    
    const validConsumables = typedConsumables.filter(c => c.quantity > 0);
    
    if (validConsumables.length === 0) {
      toast.error("Aucun consommable valide à sauvegarder");
      return;
    }
    
    const updatedSavedConsumables: Consumable[] = [
      ...savedConsumables, 
      ...validConsumables
    ];
    
    setSavedConsumables(updatedSavedConsumables);
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    toast.success("Consommables sauvegardés avec succès");
  };

  return {
    updateNewConsumable,
    handleAddConsumable,
    handleRemoveConsumable,
    handleSaveConsumables
  };
};
