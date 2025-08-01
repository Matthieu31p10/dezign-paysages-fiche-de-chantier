
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { useToastService } from '@/hooks/useToastService';

export const useWorkLogCRUD = (workLogs: WorkLog[], setWorkLogs: React.Dispatch<React.SetStateAction<WorkLog[]>>) => {
  const { workLogMessages } = useToastService();
  const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
    try {
      console.log('Adding worklog to database:', workLog);
      
      // Déterminer si c'est une fiche vierge
      const isBlankWorksheet = workLog.isBlankWorksheet || (!workLog.projectId || workLog.projectId === '');
      
      // Préparer les données communes
      const commonData = {
        id: workLog.id,
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
        created_by: workLog.createdBy || null
      };

      let data;
      let error;

      if (isBlankWorksheet) {
        // Insérer dans la table blank_worksheets
        console.log('Inserting blank worksheet:', commonData);
        const result = await supabase
          .from('blank_worksheets')
          .insert([commonData])
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // Insérer dans la table work_logs
        const workLogData = {
          ...commonData,
          project_id: workLog.projectId || ''
        };
        
        console.log('Inserting work log:', workLogData);
        const result = await supabase
          .from('work_logs')
          .insert([workLogData])
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully inserted:', data);

      // Gérer les consumables si ils existent
      if (workLog.consumables && workLog.consumables.length > 0) {
        const consumablesData = workLog.consumables.map(consumable => ({
          id: consumable.id || crypto.randomUUID(),
          [isBlankWorksheet ? 'blank_worksheet_id' : 'work_log_id']: data.id,
          supplier: consumable.supplier || '',
          product: consumable.product || '',
          unit: consumable.unit || 'unité',
          quantity: Number(consumable.quantity || 0),
          unit_price: Number(consumable.unitPrice || 0),
          total_price: Number(consumable.totalPrice || 0),
          saved_for_reuse: false
        }));

        const tableName = isBlankWorksheet ? 'blank_worksheet_consumables' : 'consumables';
        const { error: consumablesError } = await supabase
          .from(tableName)
          .insert(consumablesData);

        if (consumablesError) {
          console.error('Error inserting consumables:', consumablesError);
        }
      }

      const newWorkLog: WorkLog = {
        ...workLog,
        id: data.id,
        createdAt: new Date(data.created_at || new Date()),
        createdBy: data.created_by || workLog.createdBy,
        isBlankWorksheet
      };

      setWorkLogs((prev) => [newWorkLog, ...prev]);
      workLogMessages.created();
      return newWorkLog;
    } catch (error) {
      console.error("Error adding work log:", error);
      workLogMessages.error('créer');
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

      const isBlankWorksheet = workLogToUpdate.isBlankWorksheet || (!workLogToUpdate.projectId || workLogToUpdate.projectId === '');
      
      const updateData = {
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
        created_by: workLogToUpdate.createdBy
      };

      let error;
      if (isBlankWorksheet) {
        const result = await supabase
          .from('blank_worksheets')
          .update(updateData)
          .eq('id', id);
        error = result.error;
      } else {
        const result = await supabase
          .from('work_logs')
          .update({
            ...updateData,
            project_id: workLogToUpdate.projectId
          })
          .eq('id', id);
        error = result.error;
      }

      if (error) throw error;

      setWorkLogs((prev) => prev.map((log) => (log.id === id ? workLogToUpdate : log)));
      workLogMessages.updated();
    } catch (error) {
      console.error("Error updating work log:", error);
      workLogMessages.error('modifier');
      throw error;
    }
  };

  const deleteWorkLog = async (id: string): Promise<void> => {
    try {
      // Trouver la fiche pour déterminer le type
      const workLog = workLogs.find(log => log.id === id);
      const isBlankWorksheet = workLog?.isBlankWorksheet || (!workLog?.projectId || workLog?.projectId === '');
      
      const tableName = isBlankWorksheet ? 'blank_worksheets' : 'work_logs';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkLogs((prev) => prev.filter((log) => log.id !== id));
      workLogMessages.deleted();
    } catch (error) {
      console.error("Error deleting work log:", error);
      workLogMessages.error('supprimer');
      throw error;
    }
  };

  return {
    addWorkLog,
    updateWorkLog,
    deleteWorkLog
  };
};
