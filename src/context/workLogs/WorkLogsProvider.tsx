
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { WorkLogsContextType } from '../types';
import { toast } from 'sonner';
import { 
  loadWorkLogsFromStorage, 
  saveWorkLogsToStorage,
  deleteWorkLogFromStorage 
} from './workLogsStorage';
import { useWorkLogOperations } from './hooks/useWorkLogOperations';

const WorkLogsContext = createContext<WorkLogsContextType | undefined>(undefined);

export const WorkLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const operations = useWorkLogOperations(workLogs, setWorkLogs);

  // Charger les données de Supabase au montage initial
  useEffect(() => {
    const fetchWorkLogs = async () => {
      try {
        setIsLoading(true);
        const loadedWorkLogs = await loadWorkLogsFromStorage();
        
        // S'assurer que createdAt est un objet Date
        const formattedWorkLogs = loadedWorkLogs.map(log => {
          if (!(log.createdAt instanceof Date)) {
            log.createdAt = new Date(log.createdAt);
          }
          return log;
        });
        
        setWorkLogs(formattedWorkLogs);
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

  // Enregistrer les données dans Supabase quand elles changent
  useEffect(() => {
    if (!isLoading) {
      try {
        console.log('Saving work logs to Supabase:', workLogs);
        saveWorkLogsToStorage(workLogs);
      } catch (error) {
        console.error("Error saving work logs:", error);
      }
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
