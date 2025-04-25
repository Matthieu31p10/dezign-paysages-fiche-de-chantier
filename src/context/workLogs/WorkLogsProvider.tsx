
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { WorkLogsContextType } from '../types';
import { toast } from 'sonner';
import { loadWorkLogsFromStorage, saveWorkLogsToStorage } from './workLogsStorage';
import { useWorkLogOperations } from './hooks/useWorkLogOperations';

const WorkLogsContext = createContext<WorkLogsContextType | undefined>(undefined);

export const WorkLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const operations = useWorkLogOperations(workLogs, setWorkLogs);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const fetchWorkLogs = async () => {
      try {
        setIsLoading(true);
        const loadedWorkLogs = await loadWorkLogsFromStorage();
        setWorkLogs(loadedWorkLogs);
      } catch (error) {
        console.error("Error loading work logs:", error);
        toast.error("Erreur lors du chargement des fiches de suivi");
        setWorkLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkLogs();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveWorkLogsToStorage(workLogs);
    }
  }, [workLogs, isLoading]);

  return (
    <WorkLogsContext.Provider value={{ workLogs, isLoading, ...operations }}>
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
