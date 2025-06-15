
import React, { createContext, useContext } from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';

// Options pour la génération PDF
export interface PDFOptions {
  includeContactInfo?: boolean;
  includeCompanyInfo?: boolean;
  includePersonnel?: boolean;
  includeTasks?: boolean; 
  includeWatering?: boolean;
  includeNotes?: boolean;
  includeTimeTracking?: boolean;
  includeWasteManagement?: boolean;
  includeSummary?: boolean;
  includeConsumables?: boolean;
}

// Type pour le contexte WorkLogDetail
interface WorkLogDetailContextType {
  workLog: WorkLog | null;
  project: ProjectInfo | null;
  workLogs: WorkLog[]; // Ajout de la liste complète des work logs
  isLoading: boolean;
  isEditable: boolean;
  handleExportToPDF: (options: PDFOptions & { theme?: string }) => Promise<void>;
  isExporting: boolean;
  
  // Ajout des propriétés manquantes requises par les composants
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

// Création du contexte
const WorkLogDetailContext = createContext<WorkLogDetailContextType | undefined>(undefined);

// Composant Provider
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

// Création d'un hook pour un accès facile au contexte
export const useWorkLogDetail = () => {
  const context = useContext(WorkLogDetailContext);
  if (!context) {
    throw new Error('useWorkLogDetail must be used within WorkLogDetailProvider');
  }
  return context;
};
