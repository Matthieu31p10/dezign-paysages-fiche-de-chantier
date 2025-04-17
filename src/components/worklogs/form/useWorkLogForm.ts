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

  const selectedProjectId = form.watch('projectId');
  const date = form.watch('date');
  const selectedPersonnel = form.watch('personnel');
  const departure = form.watch('departure');
  const arrival = form.watch('arrival');
  const end = form.watch('end');
  const breakTime = form.watch('breakTime');
  
  const [filteredProjects, setFilteredProjects] = useState<ProjectInfo[]>(projectInfos);
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [timeDeviation, setTimeDeviation] = useState<string | null>(null);
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>('');
  
  const [previousYearsHours, setPreviousYearsHours] = useState<number>(0);
  const [currentYearTarget, setCurrentYearTarget] = useState<number>(0);

  useEffect(() => {
    if (selectedProjectId) {
      const project = projectInfos.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
        
        form.setValue('duration', project.visitDuration || 0);
        setCurrentYearTarget(project.annualTotalHours || 0);
        
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
        
        calculateProjectTimeDeviation(project);
      } else {
        setSelectedProject(null);
        setPreviousYearsHours(0);
        setCurrentYearTarget(0);
        setTimeDeviation(null);
        setTimeDeviationClass('');
      }
    } else {
      setSelectedProject(null);
      setPreviousYearsHours(0);
      setCurrentYearTarget(0);
      setTimeDeviation(null);
      setTimeDeviationClass('');
    }
  }, [selectedProjectId, projectInfos, existingWorkLogs, form]);
  
  const calculateProjectTimeDeviation = (project: ProjectInfo) => {
    if (!project) return;
    
    const projectLogs = existingWorkLogs.filter(log => log.projectId === project.id);
    const completedVisits = projectLogs.length;
    
    if (completedVisits === 0) {
      setTimeDeviation("Pas d'historique");
      setTimeDeviationClass('text-gray-600');
      return;
    }
    
    const totalHoursCompleted = projectLogs.reduce((total, log) => {
      if (log.timeTracking && typeof log.timeTracking.totalHours === 'number') {
        return total + log.timeTracking.totalHours;
      }
      return total;
    }, 0);
    
    const averageHoursPerVisit = totalHoursCompleted / completedVisits;
    
    if (!project.visitDuration) {
      setTimeDeviation("Durée non définie");
      setTimeDeviationClass('text-gray-600');
      return;
    }
    
    const difference = project.visitDuration - averageHoursPerVisit;
    
    let deviationText = difference === 0 
      ? "Pas d'écart" 
      : `${difference > 0 ? '+' : ''}${difference.toFixed(1)}h`;
    
    let deviationClass = difference === 0 
      ? 'text-gray-600' 
      : (difference > 0 ? 'text-amber-600' : 'text-red-600');
    
    if (Math.abs(difference) <= (project.visitDuration * 0.1)) {
      deviationClass = 'text-green-600';
    }
    
    setTimeDeviation(deviationText);
    setTimeDeviationClass(deviationClass);
  };
  
  useEffect(() => {
    if (departure && arrival && end) {
      try {
        const totalHours = calculateTotalHours(departure, arrival, end, breakTime);
        
        form.setValue('totalHours', totalHours);
        
        if (selectedProject) {
          const expectedDuration = selectedProject.visitDuration || 0;
          const deviation = totalHours - expectedDuration;
          
          let deviationText = deviation === 0 
            ? "Pas d'écart" 
            : `${deviation > 0 ? '+' : ''}${deviation.toFixed(1)}h`;
          
          let deviationClass = deviation === 0 
            ? 'text-gray-600' 
            : (deviation > 0 ? 'text-amber-600' : 'text-red-600');
          
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
  
  const handleTeamFilterChange = (teamId: string) => {
    form.setValue('teamFilter', teamId);
    
    if (teamId === 'all') {
      setFilteredProjects(projectInfos);
    } else {
      const filtered = projectInfos.filter(p => p.team === teamId);
      setFilteredProjects(filtered);
    }
  };
  
  const handlePersonnelChange = (personnel: string[]) => {
    form.setValue('personnel', personnel);
  };
  
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
