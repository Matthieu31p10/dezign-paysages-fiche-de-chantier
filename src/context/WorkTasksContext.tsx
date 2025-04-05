
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkTask } from '@/types/workTask';
import { toast } from 'sonner';

interface WorkTasksContextType {
  workTasks: WorkTask[];
  addWorkTask: (workTask: Omit<WorkTask, 'id' | 'createdAt'>) => WorkTask;
  updateWorkTask: (workTask: WorkTask) => void;
  deleteWorkTask: (id: string) => void;
  getWorkTaskById: (id: string) => WorkTask | undefined;
}

const WorkTasksContext = createContext<WorkTasksContextType | undefined>(undefined);

// Local storage key
const WORKTASKS_STORAGE_KEY = 'landscaping-worktasks';

export const WorkTasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workTasks, setWorkTasks] = useState<WorkTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charger les données depuis localStorage au montage initial
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

  // Sauvegarder les données dans localStorage chaque fois qu'elles changent
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
    // Validation des données
    if (!workTask.projectName || !workTask.date || !workTask.personnel || workTask.personnel.length === 0) {
      console.error("Invalid workTask data:", workTask);
      throw new Error('Données invalides pour la fiche de travaux');
    }
    
    const newWorkTask: WorkTask = {
      ...workTask,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setWorkTasks((prev) => [...prev, newWorkTask]);
    console.log("WorkTask added successfully:", newWorkTask);
    return newWorkTask;
  };

  const updateWorkTask = (workTask: WorkTask) => {
    // Validation des données
    if (!workTask.id || !workTask.projectName || !workTask.date) {
      console.error("Invalid workTask data for update:", workTask);
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

  const getWorkTaskById = (id: string): WorkTask | undefined => {
    return workTasks.find(task => task.id === id);
  };

  return (
    <WorkTasksContext.Provider
      value={{
        workTasks,
        addWorkTask,
        updateWorkTask,
        deleteWorkTask,
        getWorkTaskById,
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
