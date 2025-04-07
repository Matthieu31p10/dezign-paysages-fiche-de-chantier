
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charger les données depuis localStorage au montage initial
  useEffect(() => {
    try {
      setIsLoading(true);
      const storedWorkLogs = localStorage.getItem(WORKLOGS_STORAGE_KEY);
      if (storedWorkLogs) {
        const parsedLogs = JSON.parse(storedWorkLogs);
        console.log("Loaded work logs from storage:", parsedLogs);
        setWorkLogs(parsedLogs);
      }
    } catch (error) {
      console.error('Error loading work logs from localStorage:', error);
      toast.error('Erreur lors du chargement des fiches de suivi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder les données dans localStorage chaque fois qu'elles changent
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(WORKLOGS_STORAGE_KEY, JSON.stringify(workLogs));
        console.log("Saved work logs to storage:", workLogs);
      } catch (error) {
        console.error('Error saving work logs to localStorage:', error);
        toast.error('Erreur lors de l\'enregistrement des fiches de suivi');
      }
    }
  }, [workLogs, isLoading]);

  const addWorkLog = (workLog: WorkLog) => {
    // Validation des données
    if (!workLog.projectId || !workLog.date || !workLog.personnel || workLog.personnel.length === 0) {
      console.error("Invalid worklog data:", workLog);
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

  // Mise à jour d'une fiche existante avec un support pour les mises à jour partielles
  const updateWorkLog = (id: string, partialWorkLog: Partial<WorkLog>) => {
    setWorkLogs((prev) => {
      const exists = prev.some(w => w.id === id);
      if (!exists) {
        console.error(`WorkLog with ID ${id} not found for update`);
        throw new Error(`Fiche de suivi avec ID ${id} introuvable`);
      }
      
      return prev.map((w) => {
        if (w.id === id) {
          // Fusionner les objets pour une mise à jour partielle
          return { ...w, ...partialWorkLog };
        }
        return w;
      });
    });
    console.log(`WorkLog ${id} updated successfully with:`, partialWorkLog);
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs((prev) => {
      const exists = prev.some(w => w.id === id);
      if (!exists) {
        console.error(`WorkLog with ID ${id} not found for deletion`);
      }
      return prev.filter((w) => w.id !== id);
    });
    console.log("WorkLog deleted successfully:", id);
  };

  const deleteWorkLogsByProjectId = (projectId: string) => {
    setWorkLogs((prev) => {
      const filtered = prev.filter((w) => w.projectId !== projectId);
      console.log(`Deleted ${prev.length - filtered.length} worklogs for project ${projectId}`);
      return filtered;
    });
  };

  const getWorkLogById = (id: string): WorkLog | undefined => {
    return workLogs.find((workLog) => workLog.id === id);
  };

  const getWorkLogsByProjectId = (projectId: string): WorkLog[] => {
    return workLogs.filter((workLog) => workLog.projectId === projectId);
  };
  
  const getTotalDuration = (projectId: string): number => {
    return getWorkLogsByProjectId(projectId).reduce((total, log) => total + (log.duration || 0), 0);
  };
  
  const getTotalVisits = (projectId: string): number => {
    return getWorkLogsByProjectId(projectId).length;
  };
  
  const getLastVisitDate = (projectId: string): Date | null => {
    const logs = getWorkLogsByProjectId(projectId);
    if (logs.length === 0) return null;
    
    return new Date(
      Math.max(...logs.map(log => new Date(log.date).getTime()))
    );
  };

  return (
    <WorkLogsContext.Provider
      value={{
        workLogs,
        addWorkLog,
        updateWorkLog,
        deleteWorkLog,
        getWorkLogById,
        getWorkLogsByProjectId,
        getTotalDuration,
        getTotalVisits,
        getLastVisitDate,
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
