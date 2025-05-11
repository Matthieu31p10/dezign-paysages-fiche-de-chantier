
import { WorkLog, Consumable } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Load workLogs from database
 */
export const loadWorkLogsFromStorage = async (): Promise<WorkLog[]> => {
  try {
    console.log("Loading work logs from Supabase");
    
    // Fetch work logs from Supabase
    const { data: workLogsData, error: workLogsError } = await supabase
      .from('work_logs')
      .select('*');
    
    if (workLogsError) {
      throw workLogsError;
    }
    
    // Fetch all consumables to map them to their respective work logs
    const { data: consumablesData, error: consumablesError } = await supabase
      .from('consumables')
      .select('*');
    
    if (consumablesError) {
      throw consumablesError;
    }
    
    // Map the consumables to their work logs
    const workLogs: WorkLog[] = workLogsData.map(log => {
      // Find consumables for this work log
      const logConsumables = consumablesData
        .filter(c => c.work_log_id === log.id)
        .map(c => ({
          id: c.id,
          supplier: c.supplier,
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unitPrice: c.unit_price,
          totalPrice: c.total_price
        }));
      
      // Format the work log object with correct structure
      return {
        id: log.id,
        projectId: log.project_id,
        date: log.date,
        personnel: log.personnel,
        timeTracking: {
          departure: log.departure,
          arrival: log.arrival,
          end: log.end_time,
          breakTime: log.break_time,
          totalHours: log.total_hours
        },
        waterConsumption: log.water_consumption,
        wasteManagement: log.waste_management,
        tasks: log.tasks,
        notes: log.notes,
        consumables: logConsumables,
        createdAt: new Date(log.created_at),
        invoiced: log.invoiced,
        isArchived: log.is_archived,
        clientSignature: log.client_signature,
        clientName: log.client_name,
        address: log.address,
        contactPhone: log.contact_phone,
        contactEmail: log.contact_email,
        hourlyRate: log.hourly_rate,
        linkedProjectId: log.linked_project_id,
        signedQuoteAmount: log.signed_quote_amount,
        isQuoteSigned: log.is_quote_signed,
        isBlankWorksheet: log.is_blank_worksheet
      };
    });
    
    return workLogs;
  } catch (error) {
    console.error('Error loading work logs:', error);
    toast.error('Erreur lors du chargement des fiches de suivi');
    return [];
  }
};

/**
 * Save workLogs to database
 */
export const saveWorkLogsToStorage = async (workLogs: WorkLog[]): Promise<void> => {
  try {
    console.log("Saving work logs to Supabase:", workLogs);
    
    // For each work log, upsert to database
    for (const workLog of workLogs) {
      // Prepare work log data for database
      const workLogData = {
        id: workLog.id,
        project_id: workLog.projectId,
        date: workLog.date,
        personnel: workLog.personnel,
        departure: workLog.timeTracking?.departure,
        arrival: workLog.timeTracking?.arrival,
        end_time: workLog.timeTracking?.end,
        break_time: workLog.timeTracking?.breakTime,
        total_hours: workLog.timeTracking?.totalHours,
        water_consumption: workLog.waterConsumption,
        waste_management: workLog.wasteManagement,
        tasks: workLog.tasks,
        notes: workLog.notes,
        invoiced: workLog.invoiced,
        is_archived: workLog.isArchived,
        client_signature: workLog.clientSignature,
        client_name: workLog.clientName,
        address: workLog.address,
        contact_phone: workLog.contactPhone,
        contact_email: workLog.contactEmail,
        hourly_rate: workLog.hourlyRate,
        linked_project_id: workLog.linkedProjectId,
        signed_quote_amount: workLog.signedQuoteAmount,
        is_quote_signed: workLog.isQuoteSigned,
        is_blank_worksheet: workLog.isBlankWorksheet,
        created_at: workLog.createdAt.toISOString()
      };
      
      // Upsert the work log
      const { error: workLogError } = await supabase
        .from('work_logs')
        .upsert(workLogData, { onConflict: 'id' });
      
      if (workLogError) {
        throw workLogError;
      }
      
      // Handle consumables - first delete existing ones for this work log
      if (workLog.consumables && workLog.consumables.length > 0) {
        const { error: deleteError } = await supabase
          .from('consumables')
          .delete()
          .eq('work_log_id', workLog.id);
        
        if (deleteError) {
          throw deleteError;
        }
        
        // Insert updated consumables
        const consumablesData = workLog.consumables.map(c => ({
          id: c.id,
          work_log_id: workLog.id,
          supplier: c.supplier,
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unit_price: c.unitPrice,
          total_price: c.totalPrice,
          saved_for_reuse: false
        }));
        
        const { error: insertError } = await supabase
          .from('consumables')
          .insert(consumablesData);
        
        if (insertError) {
          throw insertError;
        }
      }
    }
    
    toast.success('Fiches de suivi sauvegardées avec succès');
  } catch (error) {
    console.error('Error saving work logs:', error);
    toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
    throw error;
  }
};

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
      throw error;
    }
    
    // Map database format to application format
    return data.map(c => ({
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
    toast.error('Erreur lors du chargement des consommables');
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
      throw error;
    }
    
    toast.success('Consommable sauvegardé pour réutilisation');
  } catch (error) {
    console.error('Error saving consumable for reuse:', error);
    toast.error('Erreur lors de l\'enregistrement du consommable');
    throw error;
  }
};

/**
 * Delete a work log from the database
 */
export const deleteWorkLogFromStorage = async (workLogId: string): Promise<void> => {
  try {
    console.log("Deleting work log from Supabase:", workLogId);
    
    // Delete consumables first (cascade will handle this, but being explicit)
    const { error: consumablesError } = await supabase
      .from('consumables')
      .delete()
      .eq('work_log_id', workLogId);
    
    if (consumablesError) {
      throw consumablesError;
    }
    
    // Delete the work log
    const { error: workLogError } = await supabase
      .from('work_logs')
      .delete()
      .eq('id', workLogId);
    
    if (workLogError) {
      throw workLogError;
    }
    
    toast.success('Fiche de suivi supprimée avec succès');
  } catch (error) {
    console.error('Error deleting work log:', error);
    toast.error('Erreur lors de la suppression de la fiche de suivi');
    throw error;
  }
};
