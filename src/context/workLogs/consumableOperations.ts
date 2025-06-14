
import { supabase } from '@/integrations/supabase/client';
import { Consumable } from '@/types/models';

export const loadSavedConsumables = async (): Promise<Consumable[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_consumables')
      .select('*')
      .eq('saved_for_reuse', true);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      supplier: item.supplier,
      product: item.product,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price
    }));
  } catch (error) {
    console.error('Error loading saved consumables:', error);
    return [];
  }
};
