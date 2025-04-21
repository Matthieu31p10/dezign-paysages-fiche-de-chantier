
import { Consumable } from '@/types/models';

export type ConsumableFormState = {
  supplier: string;
  product: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export const EmptyConsumable: ConsumableFormState = {
  supplier: '',
  product: '',
  unit: '',
  quantity: 0,
  unitPrice: 0,
  totalPrice: 0
};
