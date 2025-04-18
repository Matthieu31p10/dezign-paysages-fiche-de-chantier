
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { ProjectInfo } from '@/types/models';

interface UseProjectLinkHookProps {
  form: UseFormReturn<BlankWorkSheetValues>;
  projectInfos: ProjectInfo[];
}

export const useProjectLinkHook = ({ 
  form, 
  projectInfos 
}: UseProjectLinkHookProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    form.getValues().linkedProjectId || null
  );
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? projectInfos.find(p => p.id === selectedProjectId) 
    : null;
  
  // Handle project selection
  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    
    // Update the form
    form.setValue('linkedProjectId', projectId);
    
    // If a project is selected, also update client-related fields
    if (projectId) {
      const project = projectInfos.find(p => p.id === projectId);
      if (project) {
        form.setValue('clientName', project.clientName || '');
        form.setValue('address', project.address || '');
        form.setValue('contactPhone', project.contactPhone || '');
        form.setValue('contactEmail', project.contactEmail || '');
      }
    }
  };
  
  // Clear project selection
  const handleClearProject = () => {
    setSelectedProjectId(null);
    form.setValue('linkedProjectId', null);
  };
  
  return {
    selectedProject,
    selectedProjectId,
    handleProjectSelect,
    handleClearProject
  };
};
