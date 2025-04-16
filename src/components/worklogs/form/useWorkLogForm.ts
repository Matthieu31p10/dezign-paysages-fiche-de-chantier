
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormValues, formSchema } from './schema';
import { useApp } from '@/context/AppContext';
import { WorkLog, ProjectInfo } from '@/types/models';
import { calculateTotalHours } from '@/utils/time';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseWorkLogFormStateProps {
  initialData?: WorkLog;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}

export const useWorkLogFormState = ({ 
  initialData, 
  projectInfos,
  existingWorkLogs
}: UseWorkLogFormStateProps) => {
  const navigate = useNavigate();
  const { settings } = useApp();
  
  // Form initialization
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      projectId: initialData.projectId,
      date: new Date(initialData.date),
      duration: initialData.duration || 0,
      personnel: initialData.personnel || [],
      departure: initialData.timeTracking?.departure || '',
      arrival: initialData.timeTracking?.arrival || '',
      end: initialData.timeTracking?.end || '',
      breakTime: initialData.timeTracking?.breakTime || '',
      totalHours: initialData.timeTracking?.totalHours || 0,
      notes: initialData.notes || '',
      waterConsumption: initialData.waterConsumption || 0,
      teamFilter: "",
      watering: initialData.tasksPerformed?.watering || 'none',
      customTasks: initialData.tasksPerformed?.customTasks || {},
      tasksProgress: initialData.tasksPerformed?.tasksProgress || {},
      wasteManagement: initialData.wasteManagement || 'none',
    } : {
      teamFilter: "",
      watering: 'none',
      customTasks: {},
      tasksProgress: {},
      wasteManagement: 'none',
    }
  });

  // Watch for changes in key fields
  const selectedProjectId = form.watch('projectId');
  const date = form.watch('date');
  const selectedPersonnel = form.watch('personnel');
  const departure = form.watch('departure');
  const arrival = form.watch('arrival');
  const end = form.watch('end');
  const breakTime = form.watch('breakTime');
  
  // State for filtered projects
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [timeDeviation, setTimeDeviation] = useState<string | null>(null);
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>('');
  
  // Previous years information for the project
  const [previousYearsHours, setPreviousYearsHours] = useState<number>(0);
  const [currentYearTarget, setCurrentYearTarget] = useState<number>(0);

  // Update the selected project when project ID changes
  useEffect(() => {
    if (selectedProjectId) {
      const project = projectInfos.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
        
        // Set duration from project's visitDuration field
        form.setValue('duration', project.visitDuration || 0);
        
        // Update current year target
        setCurrentYearTarget(project.annualTotalHours || 0);
        
        // Calculate previous years hours for this project
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
  
  // Calculate duration and total hours when time fields change
  useEffect(() => {
    if (departure && arrival && end) {
      try {
        const totalHours = calculateTotalHours(departure, arrival, end, breakTime);
        
        // Update the form values
        form.setValue('totalHours', totalHours);
        
        // Update the time deviation if a project is selected
        if (selectedProject) {
          const expectedDuration = selectedProject.visitDuration || 0;
          const deviation = totalHours - expectedDuration;
          
          // Format the deviation with sign and decimal precision
          let deviationText = deviation === 0 
            ? "Pas d'écart" 
            : `${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}h`;
          
          // Determine the css class based on the deviation
          let deviationClass = deviation === 0 
            ? 'text-gray-600' 
            : (deviation > 0 ? 'text-amber-600' : 'text-red-600');
          
          // If the deviation is within an acceptable range (±10%), use a green color
          if (Math.abs(deviation) <= (expectedDuration * 0.1)) {
            deviationClass = 'text-green-600';
          }
          
          setTimeDeviation(deviationText);
          setTimeDeviationClass(deviationClass);
        } else {
          setTimeDeviation(null);
        }
      } catch (error) {
        console.error('Error calculating hours:', error);
      }
    }
  }, [departure, arrival, end, breakTime, selectedProject, form]);
  
  // Filter projects based on team filter
  const handleTeamFilterChange = (teamId: string) => {
    form.setValue('teamFilter', teamId);
    
    if (teamId === 'all') {
      setFilteredProjects(projectInfos);
    } else {
      const filtered = projectInfos.filter(p => p.team === teamId);
      setFilteredProjects(filtered);
    }
  };
  
  // Personnel selection handler
  const handlePersonnelChange = (personnel: string[]) => {
    form.setValue('personnel', personnel);
  };
  
  // Cancel handler
  const handleCancel = () => {
    navigate('/worklogs');
  };
  
  return {
    form,
    selectedProject,
    filteredProjects,
    timeDeviation,
    timeDeviationClass,
    handlePersonnelChange,
    handleTeamFilterChange,
    handleCancel,
    previousYearsHours,
    currentYearTarget
  };
};
