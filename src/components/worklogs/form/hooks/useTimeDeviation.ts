
import { useState, useEffect } from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../schema';
import { calculateTotalHours } from '@/utils/time';

interface UseTimeDeviationProps {
  form: UseFormReturn<FormValues>;
  selectedProject: ProjectInfo | null;
  existingWorkLogs: WorkLog[];
}

export const useTimeDeviation = ({
  form,
  selectedProject,
  existingWorkLogs
}: UseTimeDeviationProps) => {
  const [timeDeviation, setTimeDeviation] = useState<string | null>(null);
  const [timeDeviationClass, setTimeDeviationClass] = useState<string>('');

  const departure = form.watch('departure');
  const arrival = form.watch('arrival');
  const end = form.watch('end');
  const breakTime = form.watch('breakTime');

  // Calculate the time deviation based on historical data
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

  // Update time deviation when selected project changes
  useEffect(() => {
    if (selectedProject) {
      calculateProjectTimeDeviation(selectedProject);
    } else {
      setTimeDeviation(null);
      setTimeDeviationClass('');
    }
  }, [selectedProject, existingWorkLogs]);

  // Calculate total hours and time deviation when time values change
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

  return {
    timeDeviation,
    timeDeviationClass
  };
};
