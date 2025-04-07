import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blankWorkSheetSchema, BlankWorkSheetValues } from '../schema';
import { useState, useEffect } from 'react';
import { calculateTotalHours } from '@/utils/time';
import { useProjects } from '@/context/ProjectsContext';
import { WorkLog } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

export const useBlankWorksheetForm = (onSuccess?: () => void) => {
  const { addWorkLog } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [openProjectsCombobox, setOpenProjectsCombobox] = useState(false);
  const { getActiveProjects } = useProjects();
  
  const activeProjects = getActiveProjects();
  
  const form = useForm<BlankWorkSheetValues>({
    resolver: zodResolver(blankWorkSheetSchema),
    defaultValues: {
      clientName: '',
      address: '',
      date: new Date(),
      personnel: [],
      departure: '08:00',
      arrival: '08:30',
      end: '16:30',
      breakTime: '00:30',
      totalHours: 7.5,
      hourlyRate: 0,
      wasteManagement: 'none',
      teamFilter: 'all',
      linkedProjectId: '',
      workDescription: '',
      consumables: [],
      vatRate: "20",
      signedQuote: false,
    }
  });
  
  useEffect(() => {
    const departureTime = form.watch("departure");
    const arrivalTime = form.watch("arrival");
    const endTime = form.watch("end");
    const breakTimeValue = form.watch("breakTime");
    const selectedPersonnel = form.watch("personnel");
    
    if (departureTime && arrivalTime && endTime && breakTimeValue && selectedPersonnel.length > 0) {
      try {
        const calculatedTotalHours = calculateTotalHours(
          departureTime,
          arrivalTime,
          endTime,
          breakTimeValue,
          selectedPersonnel.length
        );
        
        form.setValue('totalHours', Number(calculatedTotalHours));
      } catch (error) {
        console.error("Error calculating total hours:", error);
      }
    }
  }, [form.watch("departure"), form.watch("arrival"), form.watch("end"), form.watch("breakTime"), form.watch("personnel").length, form]);
  
  useEffect(() => {
    if (selectedProject) {
      const project = activeProjects.find(p => p.id === selectedProject);
      if (project) {
        form.setValue('clientName', project.clientName || project.contact?.name || '');
        form.setValue('address', project.address || '');
        form.setValue('contactPhone', project.contactPhone || project.contact?.phone || '');
        form.setValue('contactEmail', project.contactEmail || project.contact?.email || '');
        form.setValue('linkedProjectId', project.id);
      }
    }
  }, [selectedProject, activeProjects, form]);
  
  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setOpenProjectsCombobox(false);
  };
  
  const handleClearProject = () => {
    setSelectedProject(null);
    form.setValue('linkedProjectId', '');
  };
  
  const handleSubmit = async (data: BlankWorkSheetValues) => {
    try {
      setIsSubmitting(true);
      
      if (!data.workDescription?.trim()) {
        toast.error("La description des travaux est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      const workLogData: Omit<WorkLog, 'id' | 'createdAt'> = {
        projectId: 'blank-' + Date.now().toString(),
        date: data.date,
        duration: data.totalHours,
        personnel: data.personnel,
        timeTracking: {
          departure: data.departure,
          arrival: data.arrival,
          end: data.end,
          breakTime: data.breakTime,
          totalHours: data.totalHours
        },
        tasksPerformed: {
          watering: 'none',
          notes: data.workDescription
        },
        notes: data.notes,
        wasteManagement: data.wasteManagement,
        consumables: data.consumables || []
      };
      
      addWorkLog(workLogData);
      
      toast.success("Fiche vierge créée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset({
        clientName: '',
        address: '',
        date: new Date(),
        personnel: [],
        departure: '08:00',
        arrival: '08:30',
        end: '16:30',
        breakTime: '00:30',
        totalHours: 7.5,
        hourlyRate: 0,
        wasteManagement: 'none',
        teamFilter: 'all',
        linkedProjectId: '',
        workDescription: '',
        consumables: [],
        vatRate: "20",
        signedQuote: false,
      });
      
      setSelectedProject(null);
      
    } catch (error) {
      console.error('Erreur lors de la création de la fiche:', error);
      toast.error("Erreur lors de la création de la fiche");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTeamFilterChange = (value: string) => {
    form.setValue('teamFilter', value);
  };
  
  const handlePersonnelChange = (selectedPersonnel: string[]) => {
    form.setValue('personnel', selectedPersonnel);
  };
  
  const handleCancel = () => {
    if (onSuccess) onSuccess();
  };
  
  return {
    form,
    isSubmitting,
    selectedProject,
    openProjectsCombobox,
    activeProjects,
    handleProjectSelect,
    handleClearProject,
    setOpenProjectsCombobox,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleTeamFilterChange,
    handlePersonnelChange,
    handleCancel
  };
};
