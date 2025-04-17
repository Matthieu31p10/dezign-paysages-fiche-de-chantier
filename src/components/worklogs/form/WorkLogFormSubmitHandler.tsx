
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
      
      // Validation moins stricte pour permettre des fiches incomplètes
      // On vérifie seulement le projectId comme champ obligatoire
      if (!data.projectId) {
        toast.error("Veuillez sélectionner un projet.");
        return;
      }

      // Personnel peut être vide maintenant
      const safePersonnel = Array.isArray(data.personnel) ? data.personnel : [];

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
        date: data.date ? data.date.toISOString() : new Date().toISOString(), // Default à aujourd'hui si absent
        duration: Number(data.duration) || 0,
        personnel: safePersonnel,
        timeTracking: {
          departure: data.departure || "",
          arrival: data.arrival || "",
          end: data.end || "",
          breakTime: data.breakTime || "",
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
      
      // Affichage des erreurs mais sans bloquer la soumission
      if (Object.keys(errors).length > 0) {
        toast.warning("Des champs sont incomplets mais la fiche peut être enregistrée.");
      }
    })} className="space-y-8">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
