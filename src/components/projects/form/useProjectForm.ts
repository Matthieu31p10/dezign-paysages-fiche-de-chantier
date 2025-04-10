
import { useState, useEffect } from 'react';
import { ProjectInfo } from '@/types/models';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Helper function to safely convert to a ProjectInfo object
 */
export const convertToProjectInfo = (data: any): Partial<ProjectInfo> => {
  return {
    id: data.id,
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
    createdAt: data.createdAt,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) {
      toast.error('Le nom du chantier est requis');
      return;
    }

    if (!formData.team) {
      toast.error('Une équipe doit être sélectionnée');
      return;
    }

    const projectData = convertToProjectInfo(formData);
    
    if (initialData) {
      updateProjectInfo({
        ...projectData,
        id: initialData.id,
        createdAt: initialData.createdAt,
      } as ProjectInfo);
      toast.success('Chantier mis à jour');
    } else {
      addProjectInfo(projectData as ProjectInfo);
      toast.success('Chantier ajouté');
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/projects');
    }
  };

  return {
    formData,
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
