
import { useState, useEffect } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';

interface UseProjectSelectionProps {
  form: UseFormReturn<FormValues>;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}

export const useProjectSelection = ({
  form,
  projectInfos,
  existingWorkLogs
}: UseProjectSelectionProps) => {
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [previousYearsHours, setPreviousYearsHours] = useState<number>(0);
  const [currentYearTarget, setCurrentYearTarget] = useState<number>(0);
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);

  const selectedProjectId = form.watch('projectId');

  useEffect(() => {
    if (selectedProjectId) {
      const project = projectInfos.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
        
        form.setValue('duration', project.visitDuration || 0);
        
        // Ensure we have a valid number for currentYearTarget
        const annualHours = typeof project.annualTotalHours === 'number' ? project.annualTotalHours : 0;
        setCurrentYearTarget(annualHours);
        
        const currentYear = new Date().getFullYear();
        const projectLogs = existingWorkLogs.filter(log => 
          log.projectId === project.id && 
          new Date(log.date).getFullYear() < currentYear
        );
        
        const totalPreviousHours = projectLogs.reduce((total, log) => {
          const hours = log.timeTracking?.totalHours || 0;
          return total + (typeof hours === 'string' ? parseFloat(hours) : hours);
        }, 0);
        
        setPreviousYearsHours(totalPreviousHours);
      } else {
        setSelectedProject(null);
        setPreviousYearsHours(0);
        setCurrentYearTarget(0);
      }
    } else {
      setSelectedProject(null);
      setPreviousYearsHours(0);
      setCurrentYearTarget(0);
    }
  }, [selectedProjectId, projectInfos, existingWorkLogs, form]);

  const handleTeamFilterChange = (teamId: string) => {
    form.setValue('teamFilter', teamId);
    
    if (teamId === 'all' || teamId === '') {
      setFilteredProjects(projectInfos);
    } else {
      const filtered = projectInfos.filter(p => p.team === teamId);
      setFilteredProjects(filtered);
    }
  };

  return {
    selectedProject,
    filteredProjects,
    previousYearsHours,
    currentYearTarget,
    handleTeamFilterChange
  };
};
