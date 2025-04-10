
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
import ClientSignatureSection from './form/ClientSignatureSection';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface BlankWorkSheetFormProps {
  onSuccess?: () => void;
  workLogId?: string | null;
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({ onSuccess, workLogId }) => {
  const { teams, getWorkLogById, workLogs } = useApp();
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
    loadWorkLogData
  } = useBlankWorksheetForm(onSuccess, workLogId, workLogs);
  
  // Charger les données de la fiche si un ID est fourni
  useEffect(() => {
    if (workLogId) {
      loadWorkLogData(workLogId);
    }
  }, [workLogId, loadWorkLogData]);
  
  const isEditing = !!workLogId;
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isEditing && (
          <Alert className="bg-blue-50 border-blue-100">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Vous modifiez la fiche vierge {workLogId}. Tous les champs sont modifiables.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <ProjectLinkSection 
              selectedProject={selectedProject}
              openProjectsCombobox={openProjectsCombobox}
              setOpenProjectsCombobox={setOpenProjectsCombobox}
              activeProjects={activeProjects}
              handleProjectSelect={handleProjectSelect}
              handleClearProject={handleClearProject}
            />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <ClientInfoSection />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <InterventionDetailsSection 
              teams={teams}
              handleTeamFilterChange={handleTeamFilterChange}
              handlePersonnelChange={handlePersonnelChange}
            />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <TimeTrackingFormSection />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <TasksSection />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <WasteManagementSection />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <ConsumablesSection />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <WorksheetSummary />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <ClientSignatureSection />
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <AdditionalNotesSection />
          </CardContent>
        </Card>
        
        <FormActions 
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          isEditing={isEditing}
        />
      </form>
    </Form>
  );
};

export default BlankWorkSheetForm;
