
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { WorkLogsContextType } from './types';
import { toast } from 'sonner';

const WorkLogsContext = createContext<WorkLogsContextType & { 
  deleteWorkLogsByProjectId: (projectId: string) => void 
} | undefined>(undefined);

// Local storage key
const WORKLOGS_STORAGE_KEY = 'landscaping-worklogs';

export const WorkLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedWorkLogs = localStorage.getItem(WORKLOGS_STORAGE_KEY);
      if (storedWorkLogs) setWorkLogs(JSON.parse(storedWorkLogs));
    } catch (error) {
      console.error('Error loading work logs from localStorage:', error);
      toast.error('Erreur lors du chargement des fiches de suivi');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WORKLOGS_STORAGE_KEY, JSON.stringify(workLogs));
  }, [workLogs]);

  const addWorkLog = (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => {
    const newWorkLog: WorkLog = {
      ...workLog,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setWorkLogs((prev) => [...prev, newWorkLog]);
    toast.success('Fiche de suivi ajoutée');
    return newWorkLog;
  };

  const updateWorkLog = (workLog: WorkLog) => {
    setWorkLogs((prev) =>
      prev.map((w) => (w.id === workLog.id ? workLog : w))
    );
    toast.success('Fiche de suivi mise à jour');
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs((prev) => prev.filter((w) => w.id !== id));
    toast.success('Fiche de suivi supprimée');
  };

  const deleteWorkLogsByProjectId = (projectId: string) => {
    setWorkLogs((prev) => prev.filter((w) => w.projectId !== projectId));
  };

  const getWorkLogsByProjectId = (projectId: string) => {
    return workLogs.filter((workLog) => workLog.projectId === projectId);
  };

  return (
    <WorkLogsContext.Provider
      value={{
        workLogs,
        addWorkLog,
        updateWorkLog,
        deleteWorkLog,
        getWorkLogsByProjectId,
        deleteWorkLogsByProjectId,
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
