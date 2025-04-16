
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '../date';
import { PDFData } from './types';
import { sanitizeText } from './pdfHelpers';
import { drawHeaderSection } from './sections/headerSection';
import { drawDetailsSection } from './sections/detailsSection';
import { drawInfoBoxesSection } from './sections/infoBoxesSection';
import { drawPersonnelSection } from './sections/personnelSection';
import { drawTimeTrackingSection } from './sections/timeTrackingSection';
import { drawTasksSection } from './sections/tasksSection';
import { drawNotesSection } from './sections/notesSection';
import { drawConsumablesSection } from './sections/consumablesSection';
import { addSummarySection as drawSummarySection } from './sections/summarySection';

// Cette fonction gère la génération de PDF pour les fiches de suivi avec le nouveau design
export const generateWorkLogPDF = async (data: PDFData): Promise<string> => {
  try {
    // Vérification minimale des données - permet les données manquantes
    if (!data.workLog) {
      throw new Error('Données de fiche de suivi manquantes');
    }
    
    // Initialisation du PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Couleurs
    const primaryColor = [61, 174, 43]; // Vert plus vif
    const textColor = [60, 60, 60]; // Texte gris foncé
    
    // Marge et dimensions
    const margin = 15;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    
    // Réglage des couleurs de texte
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // Position verticale courante
    let yPos = margin;
    
    // Hauteur disponible pour le contenu (en tenant compte de l'espace pour le pied de page)
    const availableHeight = pageHeight - (margin * 2) - 10; // 10mm reserved for footer
    
    // Fonction pour vérifier s'il reste assez d'espace et ajouter une page si nécessaire
    const checkAndAddPage = (requiredHeight: number): void => {
      if (yPos + requiredHeight > availableHeight) {
        // Add a new page
        pdf.addPage();
        
        // Reset vertical position to top margin
        yPos = margin;
        
        // Add a small header to indicate continuation
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        // Vérifier si c'est une fiche vierge
        const isBlankSheet = data.workLog?.projectId && 
          (data.workLog.projectId.startsWith('blank-') || data.workLog.projectId.startsWith('DZFV'));
        const docTitle = isBlankSheet ? 'Fiche Vierge' : 'Fiche de suivi';
        pdf.text(`Suite - ${data.project?.name || docTitle} - ${formatDate(data.workLog?.date)}`, margin, yPos);
        yPos += 8;
      }
    };
    
    // Dessiner l'en-tête avec le logo et les informations de l'entreprise
    if (data.pdfOptions?.includeCompanyInfo) {
      yPos = drawHeaderSection(pdf, data, margin, yPos);
    } else {
      yPos += 5; // Donner un peu d'espace en haut si pas d'en-tête d'entreprise
    }
    
    // Dessiner la section des détails du passage
    yPos = drawDetailsSection(pdf, data, margin, yPos, contentWidth);
    
    // Vérifier l'espace avant de dessiner les boîtes d'information
    checkAndAddPage(30); // Hauteur estimée pour les boîtes d'info
    
    // Dessiner les boîtes d'information
    yPos = drawInfoBoxesSection(pdf, data, margin, yPos, contentWidth);
    
    // Vérifier l'espace avant de dessiner la section personnel
    checkAndAddPage(30); // Hauteur estimée pour la section personnel
    
    // Section personnel présent
    if (data.workLog.personnel && data.workLog.personnel.length > 0) {
      yPos = drawPersonnelSection(pdf, data, margin, yPos);
    }
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Vérifier l'espace avant de dessiner la section suivi du temps
    checkAndAddPage(30); // Hauteur estimée pour le suivi du temps
    
    // Section suivi du temps
    if (data.workLog.timeTracking) {
      yPos = drawTimeTrackingSection(pdf, data, margin, yPos, contentWidth);
    }
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Vérifier l'espace avant de dessiner la section tâches
    checkAndAddPage(50); // Hauteur estimée pour les tâches
    
    // Section tâches personnalisées
    if (data.workLog.tasks) {
      yPos = drawTasksSection(pdf, data, margin, yPos, contentWidth);
    }
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Vérifier l'espace avant de dessiner la section consommables
    checkAndAddPage(50); // Hauteur estimée pour les consommables
    
    // Section consommables
    if (data.workLog.consumables && data.workLog.consumables.length > 0) {
      yPos = drawConsumablesSection(pdf, data, margin, yPos, contentWidth);
    }
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Vérifier l'espace avant de dessiner le bilan
    checkAndAddPage(50); // Hauteur estimée pour le bilan
    
    // Section bilan - pour les fiches vierges, calculer en fonction du nombre de personnel
    // Use data.hourlyRate and data.workLog.timeTracking separately
    if (data.pdfOptions?.includeSummary && data.workLog.timeTracking?.totalHours) {
      yPos = drawSummarySection(pdf, data, margin, yPos, contentWidth);
    }
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Vérifier l'espace avant de dessiner la section notes
    checkAndAddPage(60); // Hauteur estimée pour les notes
    
    // Section notes et observations (hauteur adaptative)
    if (data.workLog.notes) {
      yPos = drawNotesSection(pdf, data, margin, yPos, contentWidth);
    }
    
    // Pied de page sur chaque page
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      const currentDate = new Date();
      pdf.text(`Document généré le ${formatDate(currentDate)} - Page ${i}/${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // Génération du nom de fichier
    const isBlankSheet = data.workLog.projectId && 
      (data.workLog.projectId.startsWith('blank-') || data.workLog.projectId.startsWith('DZFV'));
    const filePrefix = isBlankSheet ? 'Fiche_Vierge' : 'Fiche_Suivi';
    const projectName = data.project?.name 
      ? sanitizeText(data.project.name).replace(/[^a-z0-9]/gi, '_')
      : 'chantier';
    const dateStr = formatDate(data.workLog.date).replace(/\//g, '-');
    const fileName = `${filePrefix}_${projectName}_${dateStr}.pdf`;
    
    pdf.save(fileName);
    return fileName;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
