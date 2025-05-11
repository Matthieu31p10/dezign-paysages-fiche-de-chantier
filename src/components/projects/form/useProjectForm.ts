
import { useState, useEffect } from 'react';
import { ProjectInfo } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to safely convert to a ProjectInfo object
 */
export const convertToProjectInfo = (data: any): Partial<ProjectInfo> => {
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name,
    address: data.address,
    contact: data.contact,
    contract: data.contract,
    irrigation: data.irrigation,
    mowerType: data.mowerType,
    annualVisits: data.annualVisits,
    annualTotalHours: data.annualTotalHours,
    visitDuration: data.visitDuration,
    additionalInfo: data.additionalInfo,
    team: data.team,
    projectType: data.projectType,
    startDate: data.startDate,
    endDate: data.endDate,
    isArchived: data.isArchived,
    createdAt: data.createdAt || new Date(),
  };
};

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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };
  
  const handleContractChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contract: {
        ...prev.contract,
        [name]: value,
      },
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/projects');
    }
  };

  const saveProjectToSupabase = async (project: ProjectInfo) => {
    try {
      // Convert the ProjectInfo object to Supabase format
      const projectData = {
        id: project.id,
        name: project.name,
        address: project.address,
        contact_name: project.contact?.name,
        contact_phone: project.contact?.phone,
        contact_email: project.contact?.email,
        contract_details: project.contract?.details,
        contract_document_url: project.contract?.documentUrl,
        irrigation: project.irrigation,
        mower_type: project.mowerType,
        annual_visits: project.annualVisits,
        annual_total_hours: project.annualTotalHours,
        visit_duration: project.visitDuration,
        additional_info: project.additionalInfo,
        team_id: project.team,
        project_type: project.projectType,
        start_date: project.startDate,
        end_date: project.endDate,
        is_archived: project.isArchived,
        created_at: project.createdAt,
        client_name: project.clientName || project.name,
      };
      
      const { error } = await supabase
        .from('projects')
        .upsert(projectData, { onConflict: 'id' });
      
      if (error) {
        console.error("Error saving project to Supabase:", error);
        throw error;
      }
      
      console.log("Project saved successfully to Supabase");
    } catch (error) {
      console.error("Error in saveProjectToSupabase:", error);
      toast.error("Erreur lors de l'enregistrement du projet dans Supabase");
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation
      if (!formData.name) {
        toast.error('Le nom du chantier est requis');
        setIsSubmitting(false);
        return;
      }

      if (!formData.team) {
        toast.error('Une équipe doit être sélectionnée');
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
