
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { useProjects } from '@/context/ProjectsContext';
import { ProjectInfo } from '@/types/models';

export const useProjectLink = (form: UseFormReturn<BlankWorkSheetValues>) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [openProjectsCombobox, setOpenProjectsCombobox] = useState(false);
  const { getActiveProjects } = useProjects();
  
  const activeProjects = getActiveProjects();
  
  // Update form values when a project is selected
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
  
  return {
    selectedProject,
    openProjectsCombobox,
    activeProjects,
    handleProjectSelect,
    handleClearProject,
    setOpenProjectsCombobox,
  };
};
