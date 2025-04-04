
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
    try {
      localStorage.setItem(WORKLOGS_STORAGE_KEY, JSON.stringify(workLogs));
    } catch (error) {
      console.error('Error saving work logs to localStorage:', error);
      toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
    }
  }, [workLogs]);

  const addWorkLog = (workLog: Omit<WorkLog, 'id' | 'createdAt'>) => {
    // Validation des données
    if (!workLog.projectId || !workLog.date || workLog.personnel.length === 0) {
      throw new Error('Données invalides pour la fiche de suivi');
    }
    
    const newWorkLog: WorkLog = {
      ...workLog,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    // Utilisation de la méthode fonctionnelle pour mise à jour de l'état
    setWorkLogs((prev) => [...prev, newWorkLog]);
    console.log("WorkLog added successfully:", newWorkLog);
    return newWorkLog;
  };

  const updateWorkLog = (workLog: WorkLog) => {
    // Validation des données
    if (!workLog.id || !workLog.projectId || !workLog.date) {
      throw new Error('Données invalides pour la mise à jour de la fiche de suivi');
    }
    
    setWorkLogs((prev) => {
      const exists = prev.some(w => w.id === workLog.id);
      if (!exists) {
        console.error(`WorkLog with ID ${workLog.id} not found for update`);
        throw new Error(`Fiche de suivi avec ID ${workLog.id} introuvable`);
      }
      return prev.map((w) => (w.id === workLog.id ? workLog : w));
    });
    console.log("WorkLog updated successfully:", workLog);
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs((prev) => {
      const exists = prev.some(w => w.id === id);
      if (!exists) {
        console.error(`WorkLog with ID ${id} not found for deletion`);
      }
      return prev.filter((w) => w.id !== id);
    });
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
