
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { WorkLogsContextType } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useWorkLogCRUD } from './hooks/useWorkLogCRUD';
import { useWorkLogQueries } from './hooks/useWorkLogQueries';
import { useWorkLogBulkOperations } from './hooks/useWorkLogBulkOperations';

const WorkLogsContext = createContext<WorkLogsContextType | undefined>(undefined);

export const WorkLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const crudOperations = useWorkLogCRUD(workLogs, setWorkLogs);
  const queryOperations = useWorkLogQueries(workLogs);
  const bulkOperations = useWorkLogBulkOperations(setWorkLogs);

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
          projectId: log.project_id || '', // Handle NULL project_id for blank worksheets
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
          createdAt: new Date(log.created_at),
          createdBy: log.created_by
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

  return (
    <WorkLogsContext.Provider
      value={{
        workLogs,
        isLoading,
        ...crudOperations,
        ...queryOperations,
        ...bulkOperations,
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
