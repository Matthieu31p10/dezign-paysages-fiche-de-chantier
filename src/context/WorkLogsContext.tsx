
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { WorkLogsContextType } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const WorkLogsContext = createContext<WorkLogsContextType | undefined>(undefined);

export const WorkLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load work logs from Supabase on mount
  useEffect(() => {
    const fetchWorkLogs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('work_logs')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        const formattedWorkLogs: WorkLog[] = data.map(log => ({
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
          isBlankWorksheet: log.is_blank_worksheet,
          createdAt: new Date(log.created_at)
        }));

        setWorkLogs(formattedWorkLogs);
      } catch (error) {
        console.error("Error loading work logs:", error);
        toast.error("Erreur lors du chargement des fiches de suivi");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkLogs();
  }, []);

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
          is_blank_worksheet: workLog.isBlankWorksheet || false
        }])
        .select()
        .single();

      if (error) throw error;

      const newWorkLog: WorkLog = {
        ...workLog,
        id: data.id,
        createdAt: new Date(data.created_at)
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
          is_blank_worksheet: workLogToUpdate.isBlankWorksheet || false
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

  const deleteWorkLog = async (id: string) => {
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

  const deleteWorkLogsByProjectId = (projectId: string) => {
    setWorkLogs((prev) => prev.filter((log) => log.projectId !== projectId));
  };

  const archiveWorkLogsByProjectId = (projectId: string, archived: boolean) => {
    setWorkLogs((prev) => prev.map((log) => 
      log.projectId === projectId ? { ...log, isArchived: archived } : log
    ));
  };

  const getWorkLogById = (id: string) => {
    return workLogs.find((log) => log.id === id);
  };

  const getWorkLogsByProjectId = (projectId: string) => {
    return workLogs.filter((log) => log.projectId === projectId);
  };

  const getTotalDuration = (projectId: string) => {
    const projectWorkLogs = getWorkLogsByProjectId(projectId);
    return projectWorkLogs.reduce((total, log) => {
      return total + (log.timeTracking?.totalHours || 0);
    }, 0);
  };

  const getTotalVisits = (projectId: string) => {
    return getWorkLogsByProjectId(projectId).length;
  };

  const getLastVisitDate = (projectId: string) => {
    const projectWorkLogs = getWorkLogsByProjectId(projectId);
    if (projectWorkLogs.length === 0) return null;
    
    const sortedLogs = projectWorkLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return new Date(sortedLogs[0].date);
  };

  return (
    <WorkLogsContext.Provider
      value={{
        workLogs,
        isLoading,
        addWorkLog,
        updateWorkLog,
        deleteWorkLog,
        deleteWorkLogsByProjectId,
        archiveWorkLogsByProjectId,
        getWorkLogById,
        getWorkLogsByProjectId,
        getTotalDuration,
        getTotalVisits,
        getLastVisitDate,
      }}
    >
      {children}
    </WorkLogsContext.Provider>
  );
};

export const useWorkLogs = () => {
  const context = useContext(WorkLogsContext);
  if (context === undefined) {
    throw new Error('useWorkLogs must be used within a WorkLogsProvider');
  }
  return context;
};
