import { WorkLog, ProjectInfo, CustomTask } from '@/types/models';

// Calculate average hours per visit
export const calculateAverageHoursPerVisit = (workLogs: WorkLog[]): number => {
  if (workLogs.length === 0) return 0;
  
  const totalHours = workLogs.reduce((sum, log) => sum + log.timeTracking.totalHours, 0);
  return Math.round((totalHours / workLogs.length) * 100) / 100;
};

// Calculate time deviation between expected and actual hours
export interface TimeDeviation {
  value: number;
  display: string;
  className: string;
}

export const calculateTimeDeviation = (expectedHours: number, workLogs: WorkLog[]): TimeDeviation => {
  if (workLogs.length === 0 || !expectedHours) {
    return { 
      value: 0, 
      display: "N/A", 
      className: "" 
    };
  }
  
  const averageHours = calculateAverageHoursPerVisit(workLogs);
  const difference = expectedHours - averageHours;
  
  return {
    value: difference,
    display: `${difference >= 0 ? '+' : ''}${difference.toFixed(2)} h`,
    className: difference >= 0 ? 'text-green-600' : 'text-red-600'
  };
};

// Get years from work logs
export const getYearsFromWorkLogs = (workLogs: WorkLog[]): number[] => {
  if (!workLogs.length) return [new Date().getFullYear()];
  
  const years = new Set<number>();
  
  workLogs.forEach(log => {
    const date = new Date(log.date);
    years.add(date.getFullYear());
  });
  
  // Add current year if not in the set
  years.add(new Date().getFullYear());
  
  return Array.from(years).sort((a, b) => b - a); // Sort in descending order
};

// Filter work logs by year
export const filterWorkLogsByYear = (workLogs: WorkLog[], year: number): WorkLog[] => {
  return workLogs.filter(log => {
    const date = new Date(log.date);
    return date.getFullYear() === year;
  });
};

// Calculate water consumption statistics
export interface WaterConsumptionStats {
  totalConsumption: number;
  monthlyConsumption: {
    month: number;
    consumption: number;
  }[];
  lastReading?: {
    date: Date;
    consumption: number;
  };
}

export const calculateWaterConsumptionStats = (workLogs: WorkLog[]): WaterConsumptionStats => {
  // Filter logs with water consumption data
  const logsWithConsumption = workLogs.filter(log => 
    log.waterConsumption !== undefined && log.waterConsumption > 0
  );
  
  // Calculate total consumption
  const totalConsumption = logsWithConsumption.reduce(
    (sum, log) => sum + (log.waterConsumption || 0), 
    0
  );
  
  // Group consumption by month
  const monthlyData: Record<number, number> = {};
  
  logsWithConsumption.forEach(log => {
    const date = new Date(log.date);
    const month = date.getMonth();
    
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    
    monthlyData[month] += log.waterConsumption || 0;
  });
  
  // Convert to array format
  const monthlyConsumption = Object.entries(monthlyData).map(([month, consumption]) => ({
    month: parseInt(month),
    consumption: Number(consumption.toFixed(2))
  })).sort((a, b) => a.month - b.month);
  
  // Get the most recent reading
  let lastReading: { date: Date; consumption: number } | undefined;
  
  if (logsWithConsumption.length > 0) {
    const mostRecentLog = logsWithConsumption.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    lastReading = {
      date: new Date(mostRecentLog.date),
      consumption: mostRecentLog.waterConsumption || 0
    };
  }
  
  return {
    totalConsumption: Number(totalConsumption.toFixed(2)),
    monthlyConsumption,
    lastReading
  };
};

// Calculate task statistics
export interface TaskStatistics {
  totalTasks: number;
  taskCounts: {
    watering: number;
    customTasks: {
      [id: string]: {
        count: number;
        name: string;
      }
    }
  }
}

export const calculateTaskStatistics = (workLogs: WorkLog[], customTasks: CustomTask[]): TaskStatistics => {
  const taskCounts = {
    watering: 0,
    customTasks: {} as { [id: string]: { count: number; name: string } }
  };
  
  // Initialize custom tasks counts
  customTasks.forEach(task => {
    taskCounts.customTasks[task.id] = {
      count: 0,
      name: task.name
    };
  });
  
  // Count tasks
  workLogs.forEach(log => {
    // Count watering tasks
    if (log.tasksPerformed?.watering && log.tasksPerformed.watering !== 'none') {
      taskCounts.watering++;
    }
    
    // Count custom tasks
    if (log.tasksPerformed?.customTasks) {
      Object.entries(log.tasksPerformed.customTasks).forEach(([id, isDone]) => {
        if (isDone && taskCounts.customTasks[id]) {
          taskCounts.customTasks[id].count++;
        }
      });
    }
  });
  
  const totalTasks = taskCounts.watering + 
    Object.values(taskCounts.customTasks).reduce((sum, task) => sum + task.count, 0);
  
  return {
    totalTasks,
    taskCounts
  };
};

export const getTasksStatistics = (workLogs: WorkLog[]) => {
  const taskStats = {
    watering: 0,
    customTasks: {} as Record<string, number>
  };

  workLogs.forEach(log => {
    if (log.tasksPerformed) {
      // Count watering tasks
      if (log.tasksPerformed.watering && log.tasksPerformed.watering !== 'none') {
        taskStats.watering++;
      }
      
      // Count custom tasks
      if (log.tasksPerformed.customTasks) {
        Object.entries(log.tasksPerformed.customTasks).forEach(([task, completed]) => {
          if (completed) {
            taskStats.customTasks[task] = (taskStats.customTasks[task] || 0) + 1;
          }
        });
      }
    }
  });

  return taskStats;
};
