
import { PDFData } from '../types';
import { drawInfoBox, pdfColors } from '../pdfHelpers';
import { formatWasteManagement } from '@/utils/format-helpers';

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  const workLog = data.workLog;
  if (!workLog) return yPos;

  // Configuration des boîtes d'informations en grille 2x2
  const boxWidth = (contentWidth - 10) / 2; // 2 colonnes avec espacement
  const boxHeight = 20;
  const spacing = 5;
  
  // Première ligne : Date et Projet
  // Date
  drawInfoBox(pdf, margin, yPos, boxWidth, boxHeight, "Date d'intervention", () => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const dateText = workLog.date ? new Date(workLog.date).toLocaleDateString('fr-FR') : 'Non renseignée';
    pdf.text(dateText, margin + 5, yPos + 14);
  });
  
  // Projet
  drawInfoBox(pdf, margin + boxWidth + spacing, yPos, boxWidth, boxHeight, "Projet", () => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const projectText = data.project?.name || 'Projet non défini';
    // Tronquer le texte si trop long
    const maxLength = 25;
    const displayText = projectText.length > maxLength ? 
      projectText.substring(0, maxLength) + '...' : projectText;
    pdf.text(displayText, margin + boxWidth + spacing + 5, yPos + 14);
  });
  
  yPos += boxHeight + spacing;
  
  // Deuxième ligne : Équipe et Heures
  // Équipe
  drawInfoBox(pdf, margin, yPos, boxWidth, boxHeight, "Équipe", () => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const personnelText = workLog.personnel?.length ? 
      `${workLog.personnel.length} personne(s)` : 'Équipe non définie';
    pdf.text(personnelText, margin + 5, yPos + 14);
  });
  
  // Heures totales
  drawInfoBox(pdf, margin + boxWidth + spacing, yPos, boxWidth, boxHeight, "Heures totales", () => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const totalHours = workLog.timeTracking?.totalHours || (workLog as any).totalHours || 0;
    pdf.text(`${totalHours}h`, margin + boxWidth + spacing + 5, yPos + 14);
  });
  
  yPos += boxHeight + spacing;
  
  // Troisième ligne : Gestion des déchets (pleine largeur)
  drawInfoBox(pdf, margin, yPos, contentWidth, boxHeight, "Gestion des déchets", () => {
    pdf.setFontSize(10);
    const wasteText = formatWasteManagement(workLog.wasteManagement);
    
    // Couleur en fonction du type de gestion
    if (wasteText !== 'Aucun') {
      pdf.setTextColor(61, 174, 43); // Vert pour gestion active
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setTextColor(120, 120, 120); // Gris pour aucune gestion
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.text(wasteText, margin + 5, yPos + 14);
    
    // Reset couleur
    pdf.setTextColor(pdfColors.text[0], pdfColors.text[1], pdfColors.text[2]);
  });
  
  return yPos + boxHeight + 10; // Espacement après la section
};
