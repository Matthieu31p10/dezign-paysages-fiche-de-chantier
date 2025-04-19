
import { generateWorkLogPDF } from './workLogPDF';
import { generateProjectPDF } from './projectPDF';
import { generateReportPDF } from './reportPDF';
import { PDFOptions, PDFData } from './types';

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
    // For blank worksheets, don't require personnel
    const isBlankWorksheet = data.workLog.projectId && 
      (data.workLog.projectId.startsWith('blank-') || data.workLog.projectId.startsWith('DZFV'));
    
    // Only check for personnel if it's not a blank worksheet
    if (!isBlankWorksheet && (!data.workLog.personnel || data.workLog.personnel.length === 0)) {
      console.warn('Personnel manquant dans la fiche de suivi, mais continue pour les fiches vierges');
    }
    
    // Call the appropriate PDF generator with the provided data
    // Handle different actions (print or download)
    const fileName = generateWorkLogPDF(data);
    
    // If the action is print, open the PDF in a new window
    if (data.action === 'print') {
      // Print logic could be implemented here if needed
    }
    
    return fileName;
  } catch (error) {
    console.error('Erreur lors de la validation des données PDF:', error);
    throw error;
  }
};

// Exporter les types
export type { PDFOptions, PDFData };

// Exporter les fonctions de génération PDF spécifiques
export {
  generateWorkLogPDF,
  generateProjectPDF,
  generateReportPDF
};
