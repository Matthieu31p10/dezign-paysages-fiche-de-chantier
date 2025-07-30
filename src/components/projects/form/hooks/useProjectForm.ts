
import { useState } from 'react';
import { ProjectInfo } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useToastService } from '@/hooks/useToastService';
import { validateProjectData } from '../utils/projectValidation';
import { useProjectFormHandlers } from './useProjectFormHandlers';
import { saveProjectToSupabase } from '../utils/projectSupabaseOperations';
import { convertToProjectInfo } from '../utils/projectDataTransformers';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { useAuditedEntity } from '@/hooks/useAuditedEntity';

interface UseProjectFormProps {
  initialData?: ProjectInfo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useProjectForm = ({ initialData, onSuccess, onCancel }: UseProjectFormProps) => {
  const navigate = useNavigate();
  const { addProjectInfo, updateProjectInfo, teams } = useApp();
  const { archiveWorkLogsByProjectId } = useWorkLogs();
  const { projectMessages } = useToastService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Audit tracking
  const { trackCreate, trackUpdate, trackArchive, trackRestore } = useAuditedEntity({
    entityType: 'project',
    entityId: initialData?.id || 'new'
  });
  
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
    teams: initialData?.teams || [],
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
        projectMessages.error('valider');
        setIsSubmitting(false);
        return;
      }

      const projectData = convertToProjectInfo(formData);
      const projectId = initialData?.id || crypto.randomUUID();
      
      // Vérifier si le projet doit être archivé automatiquement
      const shouldAutoArchive = projectData.endDate && new Date(projectData.endDate) <= new Date();
      const wasArchived = initialData?.isArchived || false;
      
      const completeProjectInfo: ProjectInfo = {
        ...projectData,
        id: projectId,
        createdAt: initialData?.createdAt || new Date(),
        isArchived: shouldAutoArchive || projectData.isArchived
      } as ProjectInfo;
      
      // First save to Supabase
      await saveProjectToSupabase(completeProjectInfo);
      
      // Si le projet devient archivé (automatiquement ou manuellement)
      if (completeProjectInfo.isArchived && !wasArchived) {
        // Archiver toutes les fiches de suivi et fiches vierges liées
        await archiveWorkLogsByProjectId(projectId, true);
        
        if (shouldAutoArchive) {
          projectMessages.archived();
        } else {
          projectMessages.archived();
        }
      } else if (!completeProjectInfo.isArchived && wasArchived) {
        // Désarchiver toutes les fiches de suivi et fiches vierges liées
        await archiveWorkLogsByProjectId(projectId, false);
        projectMessages.unarchived();
      }
      
      // Track audit changes
      if (initialData) {
        await trackUpdate(initialData, completeProjectInfo);
        updateProjectInfo(completeProjectInfo);
        
        if (completeProjectInfo.isArchived && !wasArchived) {
          await trackArchive(completeProjectInfo);
        } else if (!completeProjectInfo.isArchived && wasArchived) {
          await trackRestore(completeProjectInfo);
        }
        
        if (!completeProjectInfo.isArchived || wasArchived) {
          projectMessages.updated();
        }
      } else {
        await trackCreate(completeProjectInfo);
        addProjectInfo(completeProjectInfo);
        if (shouldAutoArchive) {
          projectMessages.archived();
        } else {
          projectMessages.created();
        }
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      projectMessages.error(initialData ? 'modifier' : 'créer');
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
