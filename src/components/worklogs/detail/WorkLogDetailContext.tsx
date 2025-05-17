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
  confirmDelete: () => void;
  handleDeleteWorkLog: () => void;
  handleExportToPDF: (options: PDFOptions) => void;
  handleSendEmail: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

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

export const WorkLogDetailProvider: React.FC<{
  children: React.ReactNode;
  value: WorkLogDetailContextType;
}> = ({ children, value }) => {
  // Sécurité: validation des données avant de les passer au contexte
  const validatedValue = {
    ...value,
    notes: value.notes ? value.notes.substring(0, 2000) : "", // Limite à 2000 caractères
    setNotes: (notes: string) => {
      // Vérification supplémentaire de sécurité
      const sanitized = notes.substring(0, 2000);
      value.setNotes(sanitized);
    },
    handleSaveNotes: () => {
      try {
        value.handleSaveNotes();
      } catch (error) {
        console.error("Error saving notes:", error);
      }
    }
  };
  
  return (
    <WorkLogDetailContext.Provider value={validatedValue}>
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
