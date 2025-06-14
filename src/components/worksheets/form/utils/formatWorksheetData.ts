
import { BlankWorkSheetValues } from '../../schema';
import { Consumable } from '@/types/models';

export const formatStructuredNotes = (formData: BlankWorkSheetValues): string => {
  const sections = [];
  
  if (formData.interventionDetails) {
    sections.push(`Détails de l'intervention: ${formData.interventionDetails}`);
  }
  
  if (formData.additionalNotes) {
    sections.push(`Notes additionnelles: ${formData.additionalNotes}`);
  }
  
  return sections.join('\n\n');
};

export const validateConsumables = (consumables: any[]): Consumable[] => {
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
      unitPrice: Number(consumable.unitPrice) || 0,
      totalPrice: Number(consumable.totalPrice) || 0
    }));
};
