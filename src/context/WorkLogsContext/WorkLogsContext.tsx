
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
        
        // Fetch regular work logs
        const { data: workLogsData, error: workLogsError } = await supabase
          .from('work_logs')
          .select('*')
          .order('date', { ascending: false });

        if (workLogsError) throw workLogsError;

        // Fetch blank worksheets
        const { data: blankWorksheetsData, error: blankWorksheetsError } = await supabase
          .from('blank_worksheets')
          .select('*')
          .order('date', { ascending: false });

        if (blankWorksheetsError) throw blankWorksheetsError;

        // Format regular work logs
        const formattedWorkLogs: WorkLog[] = (workLogsData || []).map(log => ({
          id: log.id,
          projectId: log.project_id || '',
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
          isBlankWorksheet: false, // Regular work logs are not blank worksheets
          createdAt: new Date(log.created_at),
          createdBy: log.created_by
        }));

        // Format blank worksheets as work logs
        const formattedBlankWorksheets: WorkLog[] = (blankWorksheetsData || []).map(sheet => ({
          id: sheet.id,
          projectId: '', // Blank worksheets don't have a required project
          date: sheet.date,
          personnel: sheet.personnel,
          timeTracking: {
            departure: sheet.departure,
            arrival: sheet.arrival,
            end: sheet.end_time,
            breakTime: sheet.break_time,
            totalHours: sheet.total_hours
          },
          waterConsumption: sheet.water_consumption,
          wasteManagement: sheet.waste_management,
          tasks: sheet.tasks,
          notes: sheet.notes,
          invoiced: sheet.invoiced,
          isArchived: sheet.is_archived,
          clientSignature: sheet.client_signature,
          clientName: sheet.client_name,
          address: sheet.address,
          contactPhone: sheet.contact_phone,
          contactEmail: sheet.contact_email,
          hourlyRate: sheet.hourly_rate,
          linkedProjectId: sheet.linked_project_id,
          signedQuoteAmount: sheet.signed_quote_amount,
          isQuoteSigned: sheet.is_quote_signed,
          isBlankWorksheet: true, // These are blank worksheets
          createdAt: new Date(sheet.created_at),
          createdBy: sheet.created_by
        }));

        // Combine and sort all work logs by date
        const allWorkLogs = [...formattedWorkLogs, ...formattedBlankWorksheets]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setWorkLogs(allWorkLogs);
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
