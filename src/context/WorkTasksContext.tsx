
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkTask } from '@/types/models';
import { toast } from 'sonner';

export interface WorkTasksContextType {
  workTasks: WorkTask[];
  addWorkTask: (workTask: Omit<WorkTask, 'id' | 'createdAt'>) => WorkTask;
  updateWorkTask: (workTask: WorkTask) => void;
  deleteWorkTask: (id: string) => void;
}

const WorkTasksContext = createContext<WorkTasksContextType | undefined>(undefined);

// Local storage key
const WORKTASKS_STORAGE_KEY = 'landscaping-worktasks';

export const WorkTasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workTasks, setWorkTasks] = useState<WorkTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const storedWorkTasks = localStorage.getItem(WORKTASKS_STORAGE_KEY);
      if (storedWorkTasks) {
        const parsedTasks = JSON.parse(storedWorkTasks);
        console.log("Loaded work tasks from storage:", parsedTasks);
        setWorkTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading work tasks from localStorage:', error);
      toast.error('Erreur lors du chargement des fiches de travaux');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(WORKTASKS_STORAGE_KEY, JSON.stringify(workTasks));
        console.log("Saved work tasks to storage:", workTasks);
      } catch (error) {
        console.error('Error saving work tasks to localStorage:', error);
        toast.error('Erreur lors de l\'enregistrement des fiches de travaux');
      }
    }
  }, [workTasks, isLoading]);

  const addWorkTask = (workTask: Omit<WorkTask, 'id' | 'createdAt'>) => {
    // Data validation
    if (!workTask.title || !workTask.date || !workTask.personnel || workTask.personnel.length === 0) {
      console.error("Invalid worktask data:", workTask);
      throw new Error('Données invalides pour la fiche de travaux');
    }
    
    const newWorkTask: WorkTask = {
      ...workTask,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    // Use functional update method for state
    setWorkTasks((prev) => [...prev, newWorkTask]);
    console.log("WorkTask added successfully:", newWorkTask);
    return newWorkTask;
  };

  const updateWorkTask = (workTask: WorkTask) => {
    // Data validation
    if (!workTask.id || !workTask.title || !workTask.date) {
      console.error("Invalid worktask data for update:", workTask);
      throw new Error('Données invalides pour la mise à jour de la fiche de travaux');
    }
    
    setWorkTasks((prev) => {
      const exists = prev.some(w => w.id === workTask.id);
      if (!exists) {
        console.error(`WorkTask with ID ${workTask.id} not found for update`);
        throw new Error(`Fiche de travaux avec ID ${workTask.id} introuvable`);
      }
      return prev.map((w) => (w.id === workTask.id ? workTask : w));
    });
    console.log("WorkTask updated successfully:", workTask);
  };

  const deleteWorkTask = (id: string) => {
    setWorkTasks((prev) => {
      const exists = prev.some(w => w.id === id);
      if (!exists) {
        console.error(`WorkTask with ID ${id} not found for deletion`);
      }
      return prev.filter((w) => w.id !== id);
    });
    console.log("WorkTask deleted successfully:", id);
  };

  return (
    <WorkTasksContext.Provider
      value={{
        workTasks,
        addWorkTask,
        updateWorkTask,
        deleteWorkTask,
      }}
    >
      {children}
    </WorkTasksContext.Provider>
  );
};

export const useWorkTasks = () => {
  const context = useContext(WorkTasksContext);
  if (context === undefined) {
    throw new Error('useWorkTasks must be used within a WorkTasksProvider');
  }
  return context;
};
