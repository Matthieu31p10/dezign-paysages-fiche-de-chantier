
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
  
  const onSubmit = (data: FormValues) => {
    console.log("Submitting form data:", data);
    
    try {
      // Validation de sécurité des données
      if (!data.projectId || !data.date || data.personnel.length === 0) {
        toast.error("Données invalides. Veuillez vérifier les champs obligatoires.");
        return;
      }
      
      const payload = {
        projectId: data.projectId,
        date: data.date,
        duration: data.duration,
        personnel: data.personnel,
        timeTracking: {
          departure: data.departure,
          arrival: data.arrival,
          end: data.end,
          breakTime: data.breakTime,
          totalHours: data.totalHours,
        },
        tasksPerformed: {
          watering: data.watering,
          customTasks: data.customTasks || {},
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
        notes: data.notes ? data.notes.substring(0, 2000) : "", // Sécurité: limitation de la taille
        waterConsumption: data.waterConsumption,
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
      } else {
        console.log("Creating new worklog");
        const newWorkLog = addWorkLog(payload);
        console.log("New worklog created with ID:", newWorkLog.id);
        toast.success("Fiche de suivi créée avec succès!");
      }
      
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {children}
    </form>
  );
};

export default WorkLogFormSubmitHandler;
