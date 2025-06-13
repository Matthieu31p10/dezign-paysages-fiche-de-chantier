
import { useState } from 'react';
import { WorkLog } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWorkLogCRUD = (workLogs: WorkLog[], setWorkLogs: React.Dispatch<React.SetStateAction<WorkLog[]>>) => {
  const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
    try {
      const { data, error } = await supabase
        .from('work_logs')
        .insert([{
          project_id: workLog.projectId,
          date: workLog.date,
          personnel: workLog.personnel,
          departure: workLog.timeTracking?.departure,
          arrival: workLog.timeTracking?.arrival,
          end_time: workLog.timeTracking?.end,
          break_time: workLog.timeTracking?.breakTime,
          total_hours: workLog.timeTracking?.totalHours || 0,
          water_consumption: workLog.waterConsumption,
          waste_management: workLog.wasteManagement,
          tasks: workLog.tasks,
          notes: workLog.notes,
          invoiced: workLog.invoiced || false,
          is_archived: workLog.isArchived || false,
          client_signature: workLog.clientSignature,
          client_name: workLog.clientName,
          address: workLog.address,
          contact_phone: workLog.contactPhone,
          contact_email: workLog.contactEmail,
          hourly_rate: workLog.hourlyRate,
          linked_project_id: workLog.linkedProjectId,
          signed_quote_amount: workLog.signedQuoteAmount,
          is_quote_signed: workLog.isQuoteSigned || false,
          is_blank_worksheet: workLog.isBlankWorksheet || false,
          created_by: workLog.createdBy
        }])
        .select()
        .single();

      if (error) throw error;

      const newWorkLog: WorkLog = {
        ...workLog,
        id: data.id,
        createdAt: new Date(data.created_at),
        createdBy: data.created_by
      };

      setWorkLogs((prev) => [newWorkLog, ...prev]);
      toast.success('Fiche de suivi créée');
      return newWorkLog;
    } catch (error) {
      console.error("Error adding work log:", error);
      toast.error('Erreur lors de la création de la fiche');
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
