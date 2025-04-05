
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '@/context/AppContext';
import { WorkTask, WorkTaskSupplier } from '@/types/workTask';
import { Separator } from '@/components/ui/separator';

// Import schema
import { workTaskSchema, WorkTaskFormValues } from './form/WorkTaskFormSchema';

// Import form sections
import ProjectInfoSection from './form/ProjectInfoSection';
import PersonnelSection from './form/PersonnelSection';
import TimeTrackingSection from './form/TimeTrackingSection';
import TasksSection from './form/TasksSection';
import WasteManagementSection from './form/WasteManagementSection';
import SuppliesSection from './form/SuppliesSection';
import NotesSection from './form/NotesSection';
import SignaturesSection from './form/SignaturesSection';
import ActionButtons from './form/ActionButtons';

interface WorkTaskFormProps {
  initialData?: WorkTask;
  onSuccess?: () => void;
}

const WorkTaskForm: React.FC<WorkTaskFormProps> = ({ initialData, onSuccess }) => {
  const { addWorkTask, updateWorkTask } = useApp();
  const [clientSignature, setClientSignature] = useState<any>(null);
  const [teamLeadSignature, setTeamLeadSignature] = useState<any>(null);
  
  const form = useForm<WorkTaskFormValues>({
    resolver: zodResolver(workTaskSchema),
    defaultValues: initialData ? {
      projectName: initialData.projectName,
      address: initialData.address,
      contactName: initialData.contactName,
      clientPresent: initialData.clientPresent,
      date: new Date(initialData.date).toISOString().split('T')[0],
      personnel: initialData.personnel,
      timeTracking: initialData.timeTracking,
      tasksPerformed: {
        customTasks: initialData.tasksPerformed.customTasks || {},
        tasksProgress: initialData.tasksPerformed.tasksProgress || {},
      },
      wasteManagement: {
        wasteTaken: initialData.wasteManagement.wasteTaken || false,
        wasteLeft: initialData.wasteManagement.wasteLeft || false,
        wasteDetails: initialData.wasteManagement.wasteDetails || '',
      },
      notes: initialData.notes || '',
      supplies: initialData.supplies || [],
      hourlyRate: initialData.hourlyRate || 0,
    } : {
      projectName: '',
      address: '',
      contactName: '',
      clientPresent: false,
      date: new Date().toISOString().split('T')[0],
      personnel: [],
      timeTracking: {
        departure: '',
        arrival: '',
        end: '',
        breakTime: '00:00',
        travelHours: 0,
        workHours: 0,
        totalHours: 0,
      },
      tasksPerformed: {
        customTasks: {},
        tasksProgress: {},
      },
      wasteManagement: {
        wasteTaken: false,
        wasteLeft: false,
        wasteDetails: '',
      },
      notes: '',
      supplies: [],
      hourlyRate: 0,
    }
  });

  const handleSignaturesChange = (clientSig: any, teamLeadSig: any) => {
    setClientSignature(clientSig);
    setTeamLeadSignature(teamLeadSig);
  };

  const onSubmit = (values: WorkTaskFormValues) => {
    // Ensure all required fields have values to satisfy TypeScript
    const timeTracking = {
      departure: values.timeTracking.departure || '',
      arrival: values.timeTracking.arrival || '',
      end: values.timeTracking.end || '',
      breakTime: values.timeTracking.breakTime || '00:00',
      travelHours: values.timeTracking.travelHours || 0,
      workHours: values.timeTracking.workHours || 0,
      totalHours: values.timeTracking.totalHours || 0,
    };
    
    // Ensure supplies meet the required structure
    const supplies: WorkTaskSupplier[] = values.supplies.map(supply => ({
      supplier: supply.supplier || '',
      material: supply.material || '',
      unit: supply.unit || '',
      quantity: supply.quantity || 0,
      unitPrice: supply.unitPrice || 0
    }));
    
    // Create the form data object with the correct structure
    if (initialData) {
      // Update existing work task
      const updatedWorkTask: WorkTask = {
        id: initialData.id,
        createdAt: initialData.createdAt,
        projectName: values.projectName,
        address: values.address,
        contactName: values.contactName,
        clientPresent: values.clientPresent,
        date: new Date(values.date),
        personnel: values.personnel,
        timeTracking,
        tasksPerformed: {
          customTasks: values.tasksPerformed.customTasks || {},
          tasksProgress: values.tasksPerformed.tasksProgress || {},
        },
        wasteManagement: {
          wasteTaken: values.wasteManagement.wasteTaken || false,
          wasteLeft: values.wasteManagement.wasteLeft || false,
          wasteDetails: values.wasteManagement.wasteDetails || '',
        },
        notes: values.notes || '',
        supplies,
        hourlyRate: values.hourlyRate,
        signatures: {
          client: clientSignature?.getTrimmedCanvas().toDataURL('image/png') || null,
          teamLead: teamLeadSignature?.getTrimmedCanvas().toDataURL('image/png') || null,
        }
      };
      
      updateWorkTask(updatedWorkTask);
    } else {
      // Create new work task
      const newWorkTask: Omit<WorkTask, "id" | "createdAt"> = {
        projectName: values.projectName,
        address: values.address,
        contactName: values.contactName,
        clientPresent: values.clientPresent,
        date: new Date(values.date),
        personnel: values.personnel,
        timeTracking,
        tasksPerformed: {
          customTasks: values.tasksPerformed.customTasks || {},
          tasksProgress: values.tasksPerformed.tasksProgress || {},
        },
        wasteManagement: {
          wasteTaken: values.wasteManagement.wasteTaken || false,
          wasteLeft: values.wasteManagement.wasteLeft || false,
          wasteDetails: values.wasteManagement.wasteDetails || '',
        },
        notes: values.notes || '',
        supplies,
        hourlyRate: values.hourlyRate,
        signatures: {
          client: clientSignature?.getTrimmedCanvas().toDataURL('image/png') || null,
          teamLead: teamLeadSignature?.getTrimmedCanvas().toDataURL('image/png') || null,
        }
      };
      
      addWorkTask(newWorkTask);
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Section: Informations du chantier */}
        <ProjectInfoSection />
        
        {/* Section: Personnel présent */}
        <PersonnelSection />
        
        {/* Section: Suivi du temps */}
        <TimeTrackingSection />
        
        <Separator />
        
        {/* Section: Tâches personnalisées */}
        <TasksSection />
        
        <Separator />
        
        {/* Section: Gestion des déchets */}
        <WasteManagementSection />
        
        <Separator />
        
        {/* Section: Tableau des fournitures */}
        <SuppliesSection />
        
        {/* Section: Notes */}
        <NotesSection />
        
        {/* Section: Signatures */}
        <SignaturesSection onSignaturesChange={handleSignaturesChange} />
        
        {/* Boutons d'action */}
        <ActionButtons isEditing={!!initialData} />
      </form>
    </FormProvider>
  );
};

export default WorkTaskForm;
