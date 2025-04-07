
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { useWorkLogForm } from './WorkLogFormContext';
import { FormValues } from './schema';
import { WorkLog } from '@/types/models';

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
    try {
      console.log("Raw form data:", data);
      
      // Validate required fields
      if (!data.projectId || !data.date) {
        toast.error("Veuillez sélectionner un projet et une date.");
        return;
      }

      // Ensure personnel is not empty
      const safePersonnel = Array.isArray(data.personnel) && data.personnel.length > 0 
        ? data.personnel 
        : [];

      if (safePersonnel.length === 0) {
        toast.error("Veuillez sélectionner au moins un membre du personnel.");
        return;
      }

      // Handle custom tasks with proper validation and defaults
      let safeCustomTasks = {};
      if (data.customTasks) {
        // Filter out any undefined values to prevent validation issues
        Object.keys(data.customTasks).forEach(key => {
          if (typeof data.customTasks?.[key] === 'boolean') {
            safeCustomTasks[key] = data.customTasks[key];
          } else {
            // Default to false for any invalid values
            safeCustomTasks[key] = false;
          }
        });
      }

      // Ensure tasksProgress is a valid object
      const safeTasksProgress = data.tasksProgress && typeof data.tasksProgress === 'object' 
        ? data.tasksProgress 
        : {};

      // S'assurer que toutes les valeurs numériques sont traitées comme des nombres
      const payload = {
        projectId: data.projectId,
        date: data.date,
        duration: Number(data.duration) || 0,
        personnel: safePersonnel,
        timeTracking: {
          departure: data.departure || "08:00",
          arrival: data.arrival || "09:00",
          end: data.end || "17:00",
          breakTime: data.breakTime || "00:00",
          totalHours: Number(data.totalHours) || 0,
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
        notes: data.notes ? data.notes.substring(0, 2000) : "",
        waterConsumption: Number(data.waterConsumption) || undefined,
        wasteManagement: data.wasteManagement || 'none',
      };
      
      console.log("Payload for submission:", payload);
      
      let result;
      if (initialData) {
        // Pour une mise à jour, on passe l'id et les données partielles
        updateWorkLog(initialData.id, payload);
        console.log("Worklog updated successfully");
        toast.success("Fiche de suivi mise à jour avec succès!");
      } else {
        // Pour une nouvelle fiche, on crée un nouvel objet complet
        const newWorkLog: WorkLog = {
          ...payload,
          id: crypto.randomUUID(),
          createdAt: new Date()
        };
        result = await addWorkLog(newWorkLog);
        console.log("Worklog created successfully:", result);
        toast.success("Fiche de suivi créée avec succès!");
      }
      
      // Navigation
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/worklogs');
      }
    } catch (error) {
      console.error("Error saving work log:", error);
      toast.error("Erreur lors de la sauvegarde de la fiche de suivi.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => {
      console.error("Form validation errors:", errors);
      // Show more specific error messages based on the validation errors
      if (errors.projectId) {
        toast.error("Veuillez sélectionner un projet.");
      } else if (errors.personnel) {
        toast.error("Veuillez sélectionner au moins un membre du personnel.");
      } else if (errors.duration) {
        toast.error(errors.duration.message || "Problème avec la durée. Veuillez vérifier.");
      } else if (errors.customTasks) {
        toast.error("Problème avec les tâches personnalisées. Veuillez réessayer.");
      } else {
        toast.error("Veuillez vérifier les champs du formulaire.");
      }
    })} className="space-y-8">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
