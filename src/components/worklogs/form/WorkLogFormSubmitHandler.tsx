
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
    try {
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

      // Handle custom tasks: if undefined or empty, use an empty object
      const safeCustomTasks = data.customTasks && Object.keys(data.customTasks).length > 0 
        ? data.customTasks 
        : {};

      const payload = {
        projectId: data.projectId,
        date: data.date,
        duration: typeof data.duration === 'number' ? data.duration : 0,
        personnel: safePersonnel,
        timeTracking: {
          departure: data.departure || "08:00",
          arrival: data.arrival || "09:00",
          end: data.end || "17:00",
          breakTime: data.breakTime || "00:00",
          totalHours: typeof data.totalHours === 'number' ? data.totalHours : 0,
        },
        tasksPerformed: {
          watering: data.watering || 'none',
          customTasks: safeCustomTasks,
          tasksProgress: data.tasksProgress || {},
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
        waterConsumption: data.waterConsumption || undefined,
      };
      
      console.log("Payload for submission:", payload);
      
      if (initialData) {
        await updateWorkLog({ 
          ...payload, 
          id: initialData.id, 
          createdAt: initialData.createdAt 
        });
        toast.success("Fiche de suivi mise à jour avec succès!");
      } else {
        await addWorkLog(payload);
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
      toast.error("Veuillez vérifier les champs du formulaire.");
    })} className="space-y-8">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;

