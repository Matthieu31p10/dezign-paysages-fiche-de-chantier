
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkLog } from '@/types/models';
import { WorkLogsContextType } from './types';
import { toast } from 'sonner';
import { 
  loadWorkLogsFromStorage, 
  saveWorkLogsToStorage 
} from './workLogs/workLogsStorage';
import { 
  getWorkLogById, 
  getWorkLogsByProjectId, 
  getTotalDuration, 
  getTotalVisits, 
  getLastVisitDate 
} from './workLogs/workLogsOperations';

// Extended context type with additional methods
interface ExtendedWorkLogsContextType extends WorkLogsContextType {
  deleteWorkLogsByProjectId: (projectId: string) => void;
  updateWorkLog: (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>) => void;
  archiveWorkLogsByProjectId: (projectId: string, archive: boolean) => void;
}

const WorkLogsContext = createContext<ExtendedWorkLogsContextType | undefined>(undefined);

export const WorkLogsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const loadedWorkLogs = loadWorkLogsFromStorage();
      setWorkLogs(loadedWorkLogs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveWorkLogsToStorage(workLogs);
    }
  }, [workLogs, isLoading]);

  /**
   * Add a new workLog
   */
  const addWorkLog = async (workLog: WorkLog): Promise<WorkLog> => {
    // Validate data
    if (!workLog.projectId || !workLog.date || !workLog.personnel || workLog.personnel.length === 0) {
      console.error("Invalid worklog data:", workLog);
      throw new Error('Données invalides pour la fiche de suivi');
    }
    
    const newWorkLog: WorkLog = {
      ...workLog,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    // Use functional state update
    setWorkLogs((prev) => [...prev, newWorkLog]);
    console.log("WorkLog added successfully:", newWorkLog);
    return newWorkLog;
  };

  /**
   * Update an existing workLog - supports both single ID and full WorkLog object
   */
  const updateWorkLog = async (idOrWorkLog: string | WorkLog, partialWorkLog?: Partial<WorkLog>): Promise<void> => {
    setWorkLogs((prev) => {
      // Handle case where first argument is an ID string and second is a partial worklog
      if (typeof idOrWorkLog === 'string' && partialWorkLog) {
        const id = idOrWorkLog;
        const exists = prev.some(w => w.id === id);
        
        if (!exists) {
          console.error(`WorkLog with ID ${id} not found for update`);
          throw new Error(`Fiche de suivi avec ID ${id} introuvable`);
        }
        
        return prev.map((w) => {
          if (w.id === id) {
            // Merge objects for partial update
            return { ...w, ...partialWorkLog };
          }
          return w;
        });
      }
      
      // Handle case where first argument is a complete WorkLog object
      if (typeof idOrWorkLog !== 'string') {
        const workLog = idOrWorkLog;
        const exists = prev.some(w => w.id === workLog.id);
        
        if (!exists) {
          console.error(`WorkLog with ID ${workLog.id} not found for update`);
          throw new Error(`Fiche de suivi avec ID ${workLog.id} introuvable`);
        }
        
        return prev.map((w) => {
          if (w.id === workLog.id) {
            return workLog;
          }
          return w;
        });
      }
      
      return prev;
    });
    
    console.log(`WorkLog updated successfully:`, idOrWorkLog);
  };

  /**
   * Delete a workLog by its ID
   */
  const deleteWorkLog = (id: string): void => {
    setWorkLogs((prev) => {
      const exists = prev.some(w => w.id === id);
      if (!exists) {
        console.error(`WorkLog with ID ${id} not found for deletion`);
      }
      return prev.filter((w) => w.id !== id);
    });
    console.log("WorkLog deleted successfully:", id);
  };

  /**
   * Delete all workLogs for a specific project
   */
  const deleteWorkLogsByProjectId = (projectId: string): void => {
    setWorkLogs((prev) => {
      const filtered = prev.filter((w) => w.projectId !== projectId);
      console.log(`Deleted ${prev.length - filtered.length} worklogs for project ${projectId}`);
      return filtered;
    });
  };

  /**
   * Archive or unarchive all workLogs for a specific project
   */
  const archiveWorkLogsByProjectId = (projectId: string, archive: boolean): void => {
    setWorkLogs((prev) => {
      const updated = prev.map(workLog => {
        if (workLog.projectId === projectId) {
          return {
            ...workLog,
            isArchived: archive
          };
        }
        return workLog;
      });
      
      console.log(`${archive ? 'Archived' : 'Unarchived'} worklogs for project ${projectId}`);
      return updated;
    });
  };

  // Create the context value with all required methods
  const contextValue: ExtendedWorkLogsContextType = {
    workLogs,
    addWorkLog,
    updateWorkLog,
    deleteWorkLog,
    getWorkLogById: (id) => getWorkLogById(workLogs, id),
    getWorkLogsByProjectId: (projectId) => getWorkLogsByProjectId(workLogs, projectId),
    getTotalDuration: (projectId) => getTotalDuration(workLogs, projectId),
    getTotalVisits: (projectId) => getTotalVisits(workLogs, projectId),
    getLastVisitDate: (projectId) => getLastVisitDate(workLogs, projectId),
    deleteWorkLogsByProjectId,
    archiveWorkLogsByProjectId,
  };

  return (
    <WorkLogsContext.Provider value={contextValue}>
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
