
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkLogCRUD = (workLogs: WorkLog[], setWorkLogs: React.Dispatch<React.SetStateAction<WorkLog[]>>) => {
  const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
    try {
      console.log('Adding worklog to Supabase:', workLog);
      
      // Formatter les données pour Supabase
      const workLogForDB = {
        id: workLog.id,
        project_id: workLog.projectId || '',
        date: workLog.date,
        personnel: workLog.personnel || [],
        departure: workLog.timeTracking?.departure || '',
        arrival: workLog.timeTracking?.arrival || '',
        end_time: workLog.timeTracking?.end || '',
        break_time: workLog.timeTracking?.breakTime || '',
        total_hours: Number(workLog.timeTracking?.totalHours || 0),
        water_consumption: Number(workLog.waterConsumption || 0),
        waste_management: workLog.wasteManagement || 'none',
        tasks: workLog.tasks || '',
        notes: workLog.notes || '',
        invoiced: Boolean(workLog.invoiced),
        is_archived: Boolean(workLog.isArchived),
        client_signature: workLog.clientSignature || null,
        client_name: workLog.clientName || null,
        address: workLog.address || null,
        contact_phone: workLog.contactPhone || null,
        contact_email: workLog.contactEmail || null,
        hourly_rate: workLog.hourlyRate ? Number(workLog.hourlyRate) : null,
        linked_project_id: workLog.linkedProjectId || null,
        signed_quote_amount: workLog.signedQuoteAmount ? Number(workLog.signedQuoteAmount) : null,
        is_quote_signed: Boolean(workLog.isQuoteSigned),
        is_blank_worksheet: Boolean(workLog.isBlankWorksheet),
        created_by: workLog.createdBy || null
      };

      console.log('Formatted data for Supabase:', workLogForDB);

      const { data, error } = await supabase
        .from('work_logs')
        .insert([workLogForDB])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully inserted worklog:', data);

      // Gérer les consumables séparément si ils existent
      if (workLog.consumables && workLog.consumables.length > 0) {
        const consumablesForDB = workLog.consumables.map(consumable => ({
          id: consumable.id,
          work_log_id: data.id,
          supplier: consumable.supplier || '',
          product: consumable.product || '',
          unit: consumable.unit || 'unité',
          quantity: Number(consumable.quantity || 0),
          unit_price: Number(consumable.unitPrice || 0),
          total_price: Number(consumable.totalPrice || 0),
          saved_for_reuse: false
        }));

        const { error: consumablesError } = await supabase
          .from('consumables')
          .insert(consumablesForDB);

        if (consumablesError) {
          console.error('Error inserting consumables:', consumablesError);
          // Ne pas bloquer pour les consumables, juste logger l'erreur
        }
      }

      const newWorkLog: WorkLog = {
        ...workLog,
        id: data.id,
        createdAt: new Date(data.created_at),
        createdBy: data.created_by || workLog.createdBy
      };

      setWorkLogs((prev) => [newWorkLog, ...prev]);
      return newWorkLog;
    } catch (error) {
      console.error("Error adding work log:", error);
      throw error;
    }
  };

  const updateWorkLog = async (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>): Promise<void> => {
    try {
      let workLogToUpdate: WorkLog;
      let id: string;

      if (typeof idOrWorkLog === 'string') {
        id = idOrWorkLog;
        const existingWorkLog = workLogs.find(log => log.id === id);
        if (!existingWorkLog || !partialWorkLog) {
          throw new Error('WorkLog not found or partial data not provided');
        }
        workLogToUpdate = { ...existingWorkLog, ...partialWorkLog };
      } else {
        workLogToUpdate = idOrWorkLog;
        id = workLogToUpdate.id;
      }

      const { error } = await supabase
        .from('work_logs')
        .update({
          project_id: workLogToUpdate.projectId,
          date: workLogToUpdate.date,
          personnel: workLogToUpdate.personnel,
          departure: workLogToUpdate.timeTracking?.departure,
          arrival: workLogToUpdate.timeTracking?.arrival,
          end_time: workLogToUpdate.timeTracking?.end,
          break_time: workLogToUpdate.timeTracking?.breakTime,
          total_hours: workLogToUpdate.timeTracking?.totalHours || 0,
          water_consumption: workLogToUpdate.waterConsumption,
          waste_management: workLogToUpdate.wasteManagement,
          tasks: workLogToUpdate.tasks,
          notes: workLogToUpdate.notes,
          invoiced: workLogToUpdate.invoiced || false,
          is_archived: workLogToUpdate.isArchived || false,
          client_signature: workLogToUpdate.clientSignature,
          client_name: workLogToUpdate.clientName,
          address: workLogToUpdate.address,
          contact_phone: workLogToUpdate.contactPhone,
          contact_email: workLogToUpdate.contactEmail,
          hourly_rate: workLogToUpdate.hourlyRate,
          linked_project_id: workLogToUpdate.linkedProjectId,
          signed_quote_amount: workLogToUpdate.signedQuoteAmount,
          is_quote_signed: workLogToUpdate.isQuoteSigned || false,
          is_blank_worksheet: workLogToUpdate.isBlankWorksheet || false,
          created_by: workLogToUpdate.createdBy
        })
        .eq('id', id);

      if (error) throw error;

      setWorkLogs((prev) => prev.map((log) => (log.id === id ? workLogToUpdate : log)));
      toast.success('Fiche de suivi mise à jour');
    } catch (error) {
      console.error("Error updating work log:", error);
      toast.error('Erreur lors de la mise à jour de la fiche');
      throw error;
    }
  };

  const deleteWorkLog = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('work_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkLogs((prev) => prev.filter((log) => log.id !== id));
      toast.success('Fiche de suivi supprimée');
    } catch (error) {
      console.error("Error deleting work log:", error);
      toast.error('Erreur lors de la suppression de la fiche');
      throw error;
    }
  };

  return {
    addWorkLog,
    updateWorkLog,
    deleteWorkLog
  };
};
