
import React, { createContext, useContext, useState } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';

interface WorkLogDetailContextType {
  workLog: WorkLog;
  project: ProjectInfo | undefined;
  notes: string;
  setNotes: (notes: string) => void;
  calculateEndTime: () => string;
  calculateHourDifference: () => string;
  calculateTotalTeamHours: () => string;
  handleSaveNotes: () => void;
  handleDeleteWorkLog: () => void;
  handleExportToPDF: () => void;
  handleSendEmail: () => void;
}

const WorkLogDetailContext = createContext<WorkLogDetailContextType | undefined>(undefined);

export const WorkLogDetailProvider: React.FC<{
  children: React.ReactNode;
  value: WorkLogDetailContextType;
}> = ({ children, value }) => {
  return (
    <WorkLogDetailContext.Provider value={value}>
      {children}
    </WorkLogDetailContext.Provider>
  );
};

export const useWorkLogDetail = () => {
  const context = useContext(WorkLogDetailContext);
  if (context === undefined) {
    throw new Error('useWorkLogDetail must be used within a WorkLogDetailProvider');
  }
  return context;
};
