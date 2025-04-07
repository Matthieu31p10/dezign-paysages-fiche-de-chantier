
import { Consumable as BaseConsumable } from '@/types/models';

// Local type for form state
export interface ConsumableFormState {
  supplier: string;  // Keep this required for the form state
  product: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Empty consumable for form reset
export const EmptyConsumable: ConsumableFormState = {
  supplier: '',
  product: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0
};

// Key for storing saved consumables in localStorage
export const SAVED_CONSUMABLES_KEY = 'saved_consumables';
