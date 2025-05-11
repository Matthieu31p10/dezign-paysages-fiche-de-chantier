
import { useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateProjectData } from '../utils/projectValidation';
import { useProjectFormHandlers } from './useProjectFormHandlers';
import { saveProjectToSupabase } from '../utils/projectSupabaseOperations';
import { convertToProjectInfo } from '../utils/projectDataTransformers';

interface UseProjectFormProps {
  initialData?: ProjectInfo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useProjectForm = ({ initialData, onSuccess, onCancel }: UseProjectFormProps) => {
  const navigate = useNavigate();
  const { addProjectInfo, updateProjectInfo, teams } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<ProjectInfo, 'id' | 'createdAt'>>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    contact: {
      name: initialData?.contact.name || '',
      phone: initialData?.contact.phone || '',
      email: initialData?.contact.email || '',
    },
    contract: {
      details: initialData?.contract.details || '',
      documentUrl: initialData?.contract.documentUrl || '',
    },
    irrigation: initialData?.irrigation || 'none',
    mowerType: initialData?.mowerType || 'both',
    annualVisits: initialData?.annualVisits || 0,
    annualTotalHours: initialData?.annualTotalHours || 0,
    visitDuration: initialData?.visitDuration || 0,
    additionalInfo: initialData?.additionalInfo || '',
    team: initialData?.team || (teams.length > 0 ? teams[0].id : ''),
    projectType: initialData?.projectType || '',
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    isArchived: initialData?.isArchived || false,
  });
  
  const {
    handleInputChange,
    handleContactChange,
    handleContractChange,
    handleSelectChange,
    handleDateChange
  } = useProjectFormHandlers(setFormData);
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/projects');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      const validationResult = validateProjectData(formData);
      if (!validationResult.isValid) {
        toast.error(validationResult.errorMessage);
        setIsSubmitting(false);
        return;
      }

      const projectData = convertToProjectInfo(formData);
      const projectId = initialData?.id || crypto.randomUUID();
      
      const completeProjectInfo: ProjectInfo = {
        ...projectData,
        id: projectId,
        createdAt: initialData?.createdAt || new Date(),
      } as ProjectInfo;
      
      // First save to Supabase
      await saveProjectToSupabase(completeProjectInfo);
      
      // Then update local state
      if (initialData) {
        updateProjectInfo(completeProjectInfo);
        toast.success('Chantier mis à jour et sauvegardé dans Supabase');
      } else {
        addProjectInfo(completeProjectInfo);
        toast.success('Chantier ajouté et sauvegardé dans Supabase');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur lors de la création/mise à jour du chantier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleContactChange,
    handleContractChange,
    handleSelectChange,
    handleDateChange,
    handleCancel,
    handleSubmit,
    isEditing: !!initialData
  };
};
