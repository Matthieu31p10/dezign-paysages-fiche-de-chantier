
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
      customTasks: {},
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
      
      if (!data.clientName.trim()) {
        toast.error("Le nom du client est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.address.trim()) {
        toast.error("L'adresse est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      if (!data.workDescription?.trim()) {
        toast.error("La description des travaux est obligatoire");
        setIsSubmitting(false);
        return;
      }
      
      let notesWithProjectInfo = `CLIENT: ${data.clientName}\nADRESSE: ${data.address}\n${data.contactPhone ? 'TÉL: ' + data.contactPhone + '\n' : ''}${data.contactEmail ? 'EMAIL: ' + data.contactEmail + '\n' : ''}`;
      
      if (data.linkedProjectId) {
        notesWithProjectInfo += `PROJET_LIE: ${data.linkedProjectId}\n`;
      }
      
      notesWithProjectInfo += `\nTAUX HORAIRE: ${data.hourlyRate?.toFixed(2) || '0.00'} €\n`;
      notesWithProjectInfo += `TAUX TVA: ${data.vatRate}%\n`;
      notesWithProjectInfo += `DEVIS SIGNÉ: ${data.signedQuote ? 'OUI' : 'NON'}\n`;
      
      const validConsumables = data.consumables?.filter(c => c.product && c.unit)
        .map(c => ({
          supplier: c.supplier || '',
          product: c.product,
          unit: c.unit,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          totalPrice: c.totalPrice
        })) || [];
      
      notesWithProjectInfo += `\nCONSOMMATIONS:\n`;
      validConsumables.forEach((item, index) => {
        if (item.product && item.unit) {
          notesWithProjectInfo += `${index + 1}. ${item.product} (${item.supplier || 'N/A'}): ${item.quantity} ${item.unit} x ${item.unitPrice.toFixed(2)} € = ${item.totalPrice.toFixed(2)} €\n`;
        }
      });
      
      const totalConsumables = validConsumables.reduce((sum, item) => sum + item.totalPrice, 0);
      notesWithProjectInfo += `Total consommables: ${totalConsumables.toFixed(2)} €\n`;
      
      const laborCost = data.totalHours * (data.hourlyRate || 0);
      notesWithProjectInfo += `Coût main d'œuvre: ${laborCost.toFixed(2)} €\n`;
      
      const totalHT = laborCost + totalConsumables;
      notesWithProjectInfo += `TOTAL HT: ${totalHT.toFixed(2)} €\n`;
      
      const vatAmount = totalHT * (parseInt(data.vatRate) / 100);
      notesWithProjectInfo += `TVA (${data.vatRate}%): ${vatAmount.toFixed(2)} €\n`;
      
      const totalTTC = totalHT + vatAmount;
      notesWithProjectInfo += `TOTAL TTC: ${totalTTC.toFixed(2)} €\n`;
      
      notesWithProjectInfo += `\nDESCRIPTION DES TRAVAUX:\n${data.workDescription}\n\n${data.notes || ''}`;
      
      const customTasks = data.customTasks || {};
      
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
          mowing: customTasks.mowing || false,
          brushcutting: customTasks.brushcutting || false,
          blower: customTasks.blower || false,
          manualWeeding: customTasks.manualWeeding || false,
          whiteVinegar: customTasks.whiteVinegar || false,
          pruning: {
            done: customTasks.pruning || false,
            progress: 0
          },
          watering: 'none',
          customTasks: customTasks,
          tasksProgress: data.tasksProgress
        },
        notes: notesWithProjectInfo,
        wasteManagement: data.wasteManagement,
        consumables: validConsumables
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
        customTasks: {},
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
