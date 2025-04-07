
import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/AppContext';
import { useBlankWorksheetForm } from './form/useBlankWorksheetForm';
import ProjectLinkSection from './form/ProjectLinkSection';
import ClientInfoSection from './form/ClientInfoSection';
import InterventionDetailsSection from './form/InterventionDetailsSection';
import TimeTrackingFormSection from './form/TimeTrackingFormSection';
import TasksSection from './TasksSection';
import WasteManagementSection from './WasteManagementSection';
import ConsumablesSection from './ConsumablesSection';
import WorksheetSummary from './WorksheetSummary';
import AdditionalNotesSection from './form/AdditionalNotesSection';
import FormActions from './form/FormActions';
import { BlankWorkSheetValues } from './schema';

interface BlankWorkSheetFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<BlankWorkSheetValues>;
  workLogId?: string;
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({ 
  onSuccess, 
  initialValues, 
  workLogId 
}) => {
  const { teams } = useApp();
  const {
    form,
    isSubmitting,
    selectedProject,
    openProjectsCombobox,
    activeProjects,
    handleProjectSelect,
    handleClearProject,
    setOpenProjectsCombobox,
    handleSubmit,
    handleTeamFilterChange,
    handlePersonnelChange,
    handleCancel,
    resetForm
  } = useBlankWorksheetForm(onSuccess, initialValues, workLogId);
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ProjectLinkSection 
          selectedProject={selectedProject}
          openProjectsCombobox={openProjectsCombobox}
          setOpenProjectsCombobox={setOpenProjectsCombobox}
          activeProjects={activeProjects}
          handleProjectSelect={handleProjectSelect}
          handleClearProject={handleClearProject}
        />
        
        <Separator />
        
        <ClientInfoSection />
        
        <Separator />
        
        <InterventionDetailsSection 
          teams={teams}
          handleTeamFilterChange={handleTeamFilterChange}
          handlePersonnelChange={handlePersonnelChange}
        />
        
        <Separator />
        
        <TimeTrackingFormSection />
        
        <Separator />
        
        <TasksSection />
        
        <Separator />
        
        <WasteManagementSection />
        
        <Separator />
        
        <ConsumablesSection />
        
        <Separator />
        
        <WorksheetSummary />
        
        <Separator />
        
        <AdditionalNotesSection />
        
        <FormActions 
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          isEditing={!!workLogId}
        />
      </form>
    </Form>
  );
};

export default BlankWorkSheetForm;
