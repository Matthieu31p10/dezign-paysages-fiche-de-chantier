
import { Consumable } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from './supabaseClient';

/**
 * Load saved consumables from database
 */
export const loadSavedConsumables = async (): Promise<Consumable[]> => {
  try {
    console.log("Loading saved consumables from Supabase");
    
    const { data, error } = await supabase
      .from('saved_consumables')
      .select('*')
      .eq('saved_for_reuse', true);
    
    if (error) {
      handleSupabaseError(error, 'Erreur lors du chargement des consommables');
      return [];
    }
    
    // Map database format to application format
    return (data || []).map(c => ({
      id: c.id,
      supplier: c.supplier,
      product: c.product,
      unit: c.unit,
      quantity: c.quantity,
      unitPrice: c.unit_price,
      totalPrice: c.total_price
    }));
  } catch (error) {
    console.error('Error loading saved consumables:', error);
    handleSupabaseError(error, 'Erreur lors du chargement des consommables');
    return [];
  }
};

/**
 * Save a consumable for reuse
 */
export const saveConsumableForReuse = async (consumable: Consumable): Promise<void> => {
  try {
    console.log("Saving consumable for reuse:", consumable);
    
    const { error } = await supabase
      .from('saved_consumables')
      .insert({
        id: consumable.id || crypto.randomUUID(),
        supplier: consumable.supplier,
        product: consumable.product,
        unit: consumable.unit,
        quantity: consumable.quantity,
        unit_price: consumable.unitPrice,
        total_price: consumable.totalPrice,
        saved_for_reuse: true
      });
    
    if (error) {
      handleSupabaseError(error, 'Erreur lors de l\'enregistrement du consommable');
    }
    
  } catch (error) {
    handleSupabaseError(error, 'Erreur lors de l\'enregistrement du consommable');
  }
};
