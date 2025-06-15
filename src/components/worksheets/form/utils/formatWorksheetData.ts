
import { BlankWorkSheetValues } from '../../schema';
import { BlankWorksheetConsumable } from '@/types/blankWorksheet';

export const formatStructuredNotes = (formData: BlankWorkSheetValues): string => {
  const sections = [];
  
  if (formData.notes) {
    sections.push(`Notes: ${formData.notes}`);
  }
  
  return sections.join('\n\n');
};

export const validateConsumables = (consumables: any[]): BlankWorksheetConsumable[] => {
  return consumables
    .filter(consumable => 
      consumable && 
      consumable.product && 
      consumable.product.trim() !== '' &&
      consumable.quantity && consumable.quantity > 0
    )
    .map(consumable => ({
      id: consumable.id || crypto.randomUUID(),
      supplier: consumable.supplier || '',
      product: consumable.product || '',
      unit: consumable.unit || 'unité',
      quantity: Number(consumable.quantity) || 0,
      unit_price: Number(consumable.unitPrice) || 0,
      total_price: Number(consumable.totalPrice) || 0,
      saved_for_reuse: Boolean(consumable.saved_for_reuse)
    }));
};
