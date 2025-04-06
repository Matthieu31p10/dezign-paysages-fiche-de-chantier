
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
import { drawWateringSection } from './sections/wateringSection';
import { drawNotesSection } from './sections/notesSection';

// Cette fonction gère la génération de PDF pour les fiches de suivi avec le nouveau design
export const generateWorkLogPDF = async (data: PDFData): Promise<string> => {
  try {
    // Vérification des données
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
    const contentWidth = pageWidth - (margin * 2);
    
    // Réglage des couleurs de texte
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // En-tête du document
    let yPos = margin;
    
    // Dessiner l'en-tête avec le logo et les informations de l'entreprise (version compacte)
    if (data.pdfOptions?.includeCompanyInfo) {
      yPos = drawHeaderSection(pdf, data, margin, yPos);
    } else {
      yPos += 5; // Donner un peu d'espace en haut si pas d'en-tête d'entreprise
    }
    
    // Dessiner la section des détails du passage (optimisée)
    yPos = drawDetailsSection(pdf, data, margin, yPos, pageWidth, contentWidth);
    
    // Dessiner les boîtes d'information (optimisées)
    yPos = drawInfoBoxesSection(pdf, data, margin, yPos, contentWidth);
    
    // Section personnel présent (optimisée, sur deux colonnes)
    yPos = drawPersonnelSection(pdf, data, margin, yPos);
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section suivi du temps (optimisée)
    yPos = drawTimeTrackingSection(pdf, data, margin, yPos, contentWidth);
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section arrosage et consommation d'eau (combinées)
    yPos = drawWateringSection(pdf, data, margin, yPos, contentWidth);
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section tâches personnalisées (optimisée)
    yPos = drawTasksSection(pdf, data, margin, yPos, pageWidth, contentWidth);
    
    // Ligne de séparation fine
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    
    // Section notes et observations (hauteur adaptative)
    yPos = drawNotesSection(pdf, data, margin, yPos, contentWidth);
    
    // Pied de page minimaliste
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Document généré le ${formatDate(new Date())}`, pageWidth / 2, 285, { align: 'center' });
    
    // Génération du nom de fichier
    const projectName = data.project?.name 
      ? sanitizeText(data.project.name).replace(/[^a-z0-9]/gi, '_')
      : 'chantier';
    const dateStr = formatDate(data.workLog.date).replace(/\//g, '-');
    const fileName = `Fiche_Suivi_${projectName}_${dateStr}.pdf`;
    
    pdf.save(fileName);
    return fileName;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
