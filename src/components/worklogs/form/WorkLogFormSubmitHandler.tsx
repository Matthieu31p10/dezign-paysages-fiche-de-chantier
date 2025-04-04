
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useWorkLogForm } from './WorkLogFormContext';
import { FormValues } from './schema';

interface WorkLogFormSubmitHandlerProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

const WorkLogFormSubmitHandler: React.FC<WorkLogFormSubmitHandlerProps> = ({ 
  onSuccess,
  children
}) => {
  const { form, initialData } = useWorkLogForm();
  const { handleSubmit } = form;
  const { addWorkLog, updateWorkLog } = useWorkLogs();
  const navigate = useNavigate();
  
  const onSubmit = async (data: FormValues) => {
    console.log("Submitting form data:", data);
    
    try {
      // Validation des données
      if (!data.projectId || !data.date || !data.personnel || data.personnel.length === 0) {
        toast.error("Données invalides. Veuillez vérifier les champs obligatoires.");
        return;
      }
      
      // Sécurisation des données
      const safePersonnel = Array.isArray(data.personnel) ? data.personnel : [];
      const safeDuration = typeof data.duration === 'number' ? data.duration : 0;
      const safeBreakTime = data.breakTime || "00:00";
      const safeTotalHours = typeof data.totalHours === 'number' ? data.totalHours : 0;
      
      // Assurer que customTasks et tasksProgress sont des objets
      const safeCustomTasks = typeof data.customTasks === 'object' && data.customTasks !== null ? data.customTasks : {};
      const safeTasksProgress = typeof data.tasksProgress === 'object' && data.tasksProgress !== null ? data.tasksProgress : {};
      
      const payload = {
        projectId: data.projectId,
        date: data.date,
        duration: safeDuration,
        personnel: safePersonnel,
        timeTracking: {
          departure: data.departure || "08:00",
          arrival: data.arrival || "09:00",
          end: data.end || "17:00",
          breakTime: safeBreakTime,
          totalHours: safeTotalHours,
        },
        tasksPerformed: {
          watering: data.watering || 'none',
          customTasks: safeCustomTasks,
          tasksProgress: safeTasksProgress,
          pruning: { 
            done: false,
            progress: 0
          },
          mowing: false,
          brushcutting: false,
          blower: false,
          manualWeeding: false,
          whiteVinegar: false
        },
        notes: data.notes ? data.notes.substring(0, 2000) : "", // Sécurité: limitation de la taille
        waterConsumption: data.waterConsumption || undefined,
      };
      
      console.log("Final payload:", payload);
      
      if (initialData) {
        console.log("Updating worklog with ID:", initialData.id);
        updateWorkLog({ 
          ...payload, 
          id: initialData.id, 
          createdAt: initialData.createdAt 
        });
        toast.success("Fiche de suivi mise à jour avec succès!");
        
        // Navigation après mise à jour
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/worklogs');
        }
      } else {
        console.log("Creating new worklog");
        const newWorkLog = addWorkLog(payload);
        console.log("New worklog created with ID:", newWorkLog.id);
        toast.success("Fiche de suivi créée avec succès!");
        
        // Navigation après création
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/worklogs');
        }
      }
    } catch (error) {
      console.error("Error saving work log:", error);
      toast.error("Erreur lors de la sauvegarde de la fiche de suivi.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
