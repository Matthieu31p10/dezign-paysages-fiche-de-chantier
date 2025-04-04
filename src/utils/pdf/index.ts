
import { WorkLog, ProjectInfo, CompanyInfo } from '@/types/models';
import { generateWorkLogPDF } from './workLogPDF';
import { generateProjectPDF } from './projectPDF';
import { generateReportPDF } from './reportPDF';

/**
 * PDF options for customizing content
 */
export interface PDFOptions {
  includeContactInfo?: boolean;
  includeCompanyInfo?: boolean;
  includePersonnel?: boolean;
  includeTasks?: boolean;
  includeWatering?: boolean;
  includeNotes?: boolean;
  includeTimeTracking?: boolean;
}

/**
 * Main PDF generation interface with security validations
 */
interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
  pdfOptions?: PDFOptions;
}

/**
 * Generate a PDF based on the provided data with security checks
 */
export const generatePDF = async (data: PDFData): Promise<string> => {
  // Sécurité: validation des données avant génération
  if (!data.workLog) {
    throw new Error('Données de fiche de suivi manquantes');
  }
  
  // Vérification de sécurité supplémentaire
  try {
    // Vérifier que tous les champs requis sont présents
    if (!data.workLog.personnel || data.workLog.personnel.length === 0) {
      throw new Error('Personnel manquant dans la fiche de suivi');
    }
    
    if (!data.workLog.projectId) {
      throw new Error('ID de projet manquant dans la fiche de suivi');
    }
    
    return generateWorkLogPDF(data);
  } catch (error) {
    console.error('Erreur lors de la validation des données PDF:', error);
    throw error;
  }
};

// Exporter les fonctions de génération PDF spécifiques
export {
  generateWorkLogPDF,
  generateProjectPDF,
  generateReportPDF
};
