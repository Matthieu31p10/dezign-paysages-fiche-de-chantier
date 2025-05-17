
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

// Export the context so it can be imported elsewhere
export const WorkLogDetailContext = createContext<WorkLogDetailContextType | undefined>(undefined);

// Create a hook for easy access to the context
export const useWorkLogDetail = () => {
  const context = useContext(WorkLogDetailContext);
  if (!context) {
    throw new Error('useWorkLogDetail must be used within WorkLogDetailProvider');
  }
  return context;
};
