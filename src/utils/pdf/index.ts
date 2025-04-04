
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

// Exporter les types
export type { PDFOptions, PDFData };

// Exporter les fonctions de génération PDF spécifiques
export {
  generateWorkLogPDF,
  generateProjectPDF,
  generateReportPDF
};
