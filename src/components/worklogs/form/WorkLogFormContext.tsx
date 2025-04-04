
import React, { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './schema';
import { ProjectInfo, WorkLog } from '@/types/models';

interface WorkLogFormContextType {
  form: UseFormReturn<FormValues>;
  initialData?: WorkLog;
  projectInfos: ProjectInfo[];
  existingWorkLogs: WorkLog[];
  selectedProject: ProjectInfo | null;
  timeDeviation: string;
  timeDeviationClass: string;
}

const WorkLogFormContext = createContext<WorkLogFormContextType | undefined>(undefined);

export const WorkLogFormProvider: React.FC<WorkLogFormContextType & { children: React.ReactNode }> = ({ 
  children,
  ...value
}) => {
  return (
    <WorkLogFormContext.Provider value={value}>
      {children}
    </WorkLogFormContext.Provider>
  );
};

export const useWorkLogForm = () => {
  const context = useContext(WorkLogFormContext);
  if (context === undefined) {
    throw new Error('useWorkLogForm must be used within a WorkLogFormProvider');
  }
  return context;
};
