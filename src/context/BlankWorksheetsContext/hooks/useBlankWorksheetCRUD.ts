
import { BlankWorksheet } from '@/types/blankWorksheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBlankWorksheetCRUD = (
  blankWorksheets: BlankWorksheet[], 
  setBlankWorksheets: React.Dispatch<React.SetStateAction<BlankWorksheet[]>>
) => {
  const addBlankWorksheet = async (worksheet: BlankWorksheet): Promise<BlankWorksheet> => {
    try {
      console.log('Adding blank worksheet to Supabase:', worksheet);
      
      // Prepare data for database
      const worksheetForDB = {
        id: worksheet.id,
        date: worksheet.date,
        personnel: worksheet.personnel || [],
        departure: worksheet.departure || null,
        arrival: worksheet.arrival || null,
        end_time: worksheet.end_time || null,
        break_time: worksheet.break_time || null,
        total_hours: Number(worksheet.total_hours || 0),
        water_consumption: Number(worksheet.water_consumption || 0),
        waste_management: worksheet.waste_management || 'none',
        tasks: worksheet.tasks || null,
        notes: worksheet.notes || null,
        invoiced: Boolean(worksheet.invoiced),
        is_archived: Boolean(worksheet.is_archived),
        client_signature: worksheet.client_signature || null,
        client_name: worksheet.client_name || null,
        address: worksheet.address || null,
        contact_phone: worksheet.contact_phone || null,
        contact_email: worksheet.contact_email || null,
        hourly_rate: worksheet.hourly_rate ? Number(worksheet.hourly_rate) : null,
        linked_project_id: worksheet.linked_project_id || null,
        signed_quote_amount: worksheet.signed_quote_amount ? Number(worksheet.signed_quote_amount) : null,
        is_quote_signed: Boolean(worksheet.is_quote_signed),
        created_by: worksheet.created_by || null
      };

      const { data, error } = await supabase
        .from('blank_worksheets')
        .insert([worksheetForDB])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Handle consumables separately if they exist
      if (worksheet.consumables && worksheet.consumables.length > 0) {
        const consumablesForDB = worksheet.consumables.map(consumable => ({
          id: consumable.id,
          blank_worksheet_id: data.id,
          supplier: consumable.supplier || '',
          product: consumable.product || '',
          unit: consumable.unit || 'unité',
          quantity: Number(consumable.quantity || 0),
          unit_price: Number(consumable.unit_price || 0),
          total_price: Number(consumable.total_price || 0),
          saved_for_reuse: Boolean(consumable.saved_for_reuse)
        }));

        const { error: consumablesError } = await supabase
          .from('blank_worksheet_consumables')
          .insert(consumablesForDB);

        if (consumablesError) {
          console.error('Error inserting consumables:', consumablesError);
        }
      }

      const newWorksheet: BlankWorksheet = {
        ...worksheet,
        id: data.id,
        created_at: new Date(data.created_at),
        created_by: data.created_by || worksheet.created_by
      };

      setBlankWorksheets((prev) => [newWorksheet, ...prev]);
      return newWorksheet;
    } catch (error) {
      console.error("Error adding blank worksheet:", error);
      throw error;
    }
  };

  const updateBlankWorksheet = async (worksheet: BlankWorksheet): Promise<void> => {
    try {
      const { error } = await supabase
        .from('blank_worksheets')
        .update({
          date: worksheet.date,
          personnel: worksheet.personnel,
          departure: worksheet.departure,
          arrival: worksheet.arrival,
          end_time: worksheet.end_time,
          break_time: worksheet.break_time,
          total_hours: worksheet.total_hours || 0,
          water_consumption: worksheet.water_consumption,
          waste_management: worksheet.waste_management,
          tasks: worksheet.tasks,
          notes: worksheet.notes,
          invoiced: worksheet.invoiced || false,
          is_archived: worksheet.is_archived || false,
          client_signature: worksheet.client_signature,
          client_name: worksheet.client_name,
          address: worksheet.address,
          contact_phone: worksheet.contact_phone,
          contact_email: worksheet.contact_email,
          hourly_rate: worksheet.hourly_rate,
          linked_project_id: worksheet.linked_project_id,
          signed_quote_amount: worksheet.signed_quote_amount,
          is_quote_signed: worksheet.is_quote_signed || false,
          created_by: worksheet.created_by
        })
        .eq('id', worksheet.id);

      if (error) throw error;

      setBlankWorksheets((prev) => prev.map((w) => (w.id === worksheet.id ? worksheet : w)));
      toast.success('Fiche vierge mise à jour');
    } catch (error) {
      console.error("Error updating blank worksheet:", error);
      toast.error('Erreur lors de la mise à jour de la fiche vierge');
      throw error;
    }
  };

  const deleteBlankWorksheet = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('blank_worksheets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlankWorksheets((prev) => prev.filter((w) => w.id !== id));
      toast.success('Fiche vierge supprimée');
    } catch (error) {
      console.error("Error deleting blank worksheet:", error);
      toast.error('Erreur lors de la suppression de la fiche vierge');
      throw error;
    }
  };

  return {
    addBlankWorksheet,
    updateBlankWorksheet,
    deleteBlankWorksheet
  };
};
