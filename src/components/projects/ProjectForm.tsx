
import { ProjectInfo } from '@/types/models';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectForm } from './form';
import BasicInfoSection from './form/BasicInfoSection';
import ContactSection from './form/ContactSection';
import ContractSection from './form/ContractSection';
import SiteDetailsSection from './form/SiteDetailsSection';
import SchedulingSection from './form/SchedulingSection';
import TypeAndDateSection from './form/TypeAndDateSection';
import AdditionalInfoSection from './form/AdditionalInfoSection';
import FormActions from './form/FormActions';

interface ProjectFormProps {
  initialData?: ProjectInfo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProjectForm = ({ initialData, onSuccess, onCancel }: ProjectFormProps) => {
  const {
    formData,
    handleInputChange,
    handleContactChange,
    handleContractChange,
    handleSelectChange,
    handleDateChange,
    handleCancel,
    handleSubmit,
    isEditing
  } = useProjectForm({ initialData, onSuccess, onCancel });
  
  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium">
            {isEditing ? 'Modifier la fiche chantier' : 'Nouvelle fiche chantier'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <BasicInfoSection 
              name={formData.name}
              address={formData.address}
              onInputChange={handleInputChange}
            />
            
            <ContactSection 
              contact={formData.contact}
              onContactChange={handleContactChange}
            />
            
            <ContractSection 
              contract={formData.contract}
              onContractChange={handleContractChange}
            />
            
            <SiteDetailsSection 
              irrigation={formData.irrigation}
              mowerType={formData.mowerType}
              team={formData.team}
              onSelectChange={handleSelectChange}
            />
            
            <SchedulingSection 
              annualVisits={formData.annualVisits}
              annualTotalHours={formData.annualTotalHours}
              visitDuration={formData.visitDuration}
              onInputChange={handleInputChange}
            />
            
            <TypeAndDateSection 
              projectType={formData.projectType}
              startDate={formData.startDate}
              endDate={formData.endDate}
              onSelectChange={handleSelectChange}
              onDateChange={handleDateChange}
            />
            
            <AdditionalInfoSection 
              additionalInfo={formData.additionalInfo}
              onInputChange={handleInputChange}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <FormActions 
            isEditing={isEditing}
            onCancel={handleCancel}
          />
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProjectForm;
