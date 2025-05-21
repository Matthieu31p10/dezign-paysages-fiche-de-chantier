
import React, { createContext, useContext, useState } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';

// Type for the WorkLogDetail context
interface WorkLogDetailContextType {
  workLog: WorkLog | null;
  project: ProjectInfo | null;
  isLoading: boolean;
  isEditable: boolean;
  handleExportToPDF: (options: PDFOptions & { theme?: string }) => Promise<void>;
  isExporting: boolean;
  
  // Add missing properties required by components
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  handleSaveNotes: () => void;
  calculateEndTime: (startTime: string, totalHours: number) => string;
  calculateHourDifference: (planned: number, actual: number) => number;
  calculateTotalTeamHours: () => number;
  confirmDelete: () => void;
  handleDeleteWorkLog: () => void;
  handleSendEmail: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBlankWorksheet: boolean;
}

// Options for PDF generation
export interface PDFOptions {
  includeContactInfo: boolean;
  includeCompanyInfo: boolean;
  includePersonnel: boolean;
  includeTasks: boolean; 
  includeWatering: boolean;
  includeNotes: boolean;
  includeTimeTracking: boolean;
  includeWasteManagement?: boolean;
  includeSummary?: boolean;
}

// Create the context
const WorkLogDetailContext = createContext<WorkLogDetailContextType | undefined>(undefined);

// Provider component
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

// Export the context so it can be imported elsewhere
export { WorkLogDetailContext };

// Create a hook for easy access to the context
export const useWorkLogDetail = () => {
  const context = useContext(WorkLogDetailContext);
  if (!context) {
    throw new Error('useWorkLogDetail must be used within WorkLogDetailProvider');
  }
  return context;
};
