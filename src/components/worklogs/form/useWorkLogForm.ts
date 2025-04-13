import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ProjectInfo, WorkLog } from '@/types/models';
import { FormValues } from './schema';

export const useWorkLogFormState = ({
  initialData,
  projectInfos,
  existingWorkLogs
}: {
  initialData?: WorkLog;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
}) => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [timeDeviation, setTimeDeviation] = useState<string | null>(null);
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>('');
  const [previousYearsHours, setPreviousYearsHours] = useState<number>(0);
  const [currentYearTarget, setCurrentYearTarget] = useState<number>(0);
  
  // Set up the form with default values from initialData
  const form = useForm<FormValues>({
    defaultValues: {
      projectId: initialData?.projectId || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      personnel: initialData?.personnel || [],
      timeTracking: {
        departure: initialData?.timeTracking?.departure || '',
        arrival: initialData?.timeTracking?.arrival || '',
        end: initialData?.timeTracking?.end || '',
        breakTime: initialData?.timeTracking?.breakTime || '',
      },
      duration: initialData?.duration || 8,
      waterConsumption: initialData?.waterConsumption || 0,
      wasteManagement: initialData?.wasteManagement || 'none',
      tasks: initialData?.tasks || '',
      notes: initialData?.notes || '',
      tasksPerformed: {
        watering: initialData?.tasksPerformed?.watering || 'none',
        customTasks: initialData?.tasksPerformed?.customTasks || {},
        tasksProgress: initialData?.tasksPerformed?.tasksProgress || {},
        pruning: {
          done: initialData?.tasksPerformed?.pruning?.done || false,
          progress: initialData?.tasksPerformed?.pruning?.progress || 0,
        },
        mowing: initialData?.tasksPerformed?.mowing || false,
        brushcutting: initialData?.tasksPerformed?.brushcutting || false,
        blower: initialData?.tasksPerformed?.blower || false,
        manualWeeding: initialData?.tasksPerformed?.manualWeeding || false,
        whiteVinegar: initialData?.tasksPerformed?.whiteVinegar || false,
      },
    },
  });
  
  // Watch for changes to the projectId field
  const projectId = form.watch('projectId');
  
  // Filter projects based on selected team (if any)
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const filteredProjects = projectInfos.filter((p) => !teamFilter || p.team === teamFilter);
  
  // Get selected project data
  useEffect(() => {
    if (projectId) {
      const project = projectInfos.find((p) => p.id === projectId);
      setSelectedProject(project || null);
      
      // Calculate previous years' hours
      if (project) {
        const currentYear = new Date().getFullYear();
        const projectWorkLogs = existingWorkLogs.filter(log => log.projectId === project.id);
        
        // Calculate hours from previous years
        const previousYears = projectWorkLogs.filter(log => {
          const logYear = new Date(log.date).getFullYear();
          return logYear < currentYear;
        });
        
        const totalPreviousYearsHours = previousYears.reduce((total, log) => {
          return total + (log.timeTracking?.totalHours || 0);
        }, 0);
        
        setPreviousYearsHours(totalPreviousYearsHours);
        setCurrentYearTarget(project.annualTotalHours || 0);
      }
    } else {
      setSelectedProject(null);
      setPreviousYearsHours(0);
      setCurrentYearTarget(0);
    }
  }, [projectId, projectInfos, existingWorkLogs]);
  
  // Calculate time deviation
  useEffect(() => {
    if (selectedProject) {
      const targetHours = selectedProject.visitDuration || 0;
      const projectWorkLogs = existingWorkLogs.filter(
        (log) => log.projectId === selectedProject.id
      );
      
      const totalCompleted = projectWorkLogs.reduce(
        (sum, log) => sum + (log.timeTracking?.totalHours || 0),
        0
      );
      
      const averageHoursPerVisit = projectWorkLogs.length > 0
        ? totalCompleted / projectWorkLogs.length
        : 0;
      
      const deviation = targetHours - averageHoursPerVisit;
      setTimeDeviation(deviation.toFixed(2));
      setTimeDeviationClass(deviation >= 0 ? 'text-green-600' : 'text-red-600');
    } else {
      setTimeDeviation(null);
    }
  }, [selectedProject, existingWorkLogs]);
  
  // Function to handle team filter change
  const handleTeamFilterChange = (teamId: string | null) => {
    setTeamFilter(teamId);
  };
  
  // Function to handle personnel change
  const handlePersonnelChange = (personnel: string[]) => {
    form.setValue('personnel', personnel);
  };
  
  // Function to handle cancel button click
  const handleCancel = () => {
    navigate(-1);
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
