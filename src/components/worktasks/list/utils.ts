
import { WorkTask } from '@/types/models';

// Group work tasks by month (format: 'MM-YYYY')
export const groupWorkTasksByMonth = (workTasks: WorkTask[]) => {
  return workTasks.reduce<Record<string, WorkTask[]>>((acc, task) => {
    const date = new Date(task.date);
    const month = date.getMonth() + 1; // Months are 0-indexed in JS
    const year = date.getFullYear();
    const key = `${month}-${year}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    
    acc[key].push(task);
    return acc;
  }, {});
};

// Get task duration in hours and minutes format
export const getFormattedDuration = (hours: number) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  } else {
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
  }
};
