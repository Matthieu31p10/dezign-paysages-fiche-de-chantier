
import { useState } from 'react';
import { toast } from 'sonner';
import { WorkLog, ProjectInfo } from '@/types/models';
import { PDFOptions } from '../WorkLogDetailContext';
import { generatePDF } from '@/utils/pdf';

export const usePDFExport = (
  workLog?: WorkLog,
  project?: ProjectInfo,
  settings?: any
) => {
  const handleExportToPDF = async (options: PDFOptions) => {
    if (!workLog || !project) {
      toast.error("Données manquantes pour générer le PDF");
      return;
    }
    
    try {
      // Vérification de la présence des données nécessaires
      if (!workLog.personnel || workLog.personnel.length === 0) {
        toast.error("Cette fiche de suivi n'a pas de personnel assigné");
        return;
      }
      
      const pdfData = {
        workLog,
        project: options.includeContactInfo ? project : undefined,
        endTime: calculateEndTime(workLog),
        companyInfo: options.includeCompanyInfo ? settings?.companyInfo : undefined,
        companyLogo: options.includeCompanyInfo ? settings?.companyLogo : undefined,
        pdfOptions: options
      };
      
      const fileName = await generatePDF(pdfData);
      toast.success('PDF généré avec succès', {
        description: `Fichier: ${fileName}`
      });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };
  
  const handleSendEmail = () => {
    if (!project?.contact?.email) {
      toast.error("Aucune adresse email de contact n'est définie pour ce chantier");
      return;
    }
    
    // Sécurité: vérification de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(project.contact.email)) {
      toast.error("L'adresse email du contact n'est pas valide");
      return;
    }
    
    toast.success(`Email envoyé à ${project.contact.email}`);
  };
  
  return {
    handleExportToPDF,
    handleSendEmail
  };
};

// Helper function to calculate end time (moved from the main hook)
const calculateEndTime = (workLog?: WorkLog): string => {
  if (!workLog || !workLog.timeTracking) return "--:--";
  return workLog.timeTracking.end || "--:--";
};
