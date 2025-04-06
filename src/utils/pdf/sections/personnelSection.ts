
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawPersonnelSection = (pdf: any, data: PDFData, margin: number, yPos: number): number => {
  if (!data.pdfOptions?.includePersonnel || !data.workLog?.personnel || data.workLog.personnel.length === 0) {
    return yPos;
  }
  
  yPos += 8; // Réduire l'espace vertical avant cette section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Personnel présent", margin, yPos);
  
  // Afficher le personnel sur deux colonnes pour gagner de l'espace
  const colWidth = 85; // Largeur de chaque colonne
  yPos += 8;
  pdf.setFontSize(9); // Réduire la taille de police
  pdf.setFont('helvetica', 'normal');
  
  const halfLength = Math.ceil(data.workLog.personnel.length / 2);
  
  for (let i = 0; i < halfLength; i++) {
    // Première colonne
    if (data.workLog.personnel[i]) {
      pdf.circle(margin + 2, yPos + 1.5, 1, 'S');
      pdf.text(sanitizeText(data.workLog.personnel[i]), margin + 6, yPos + 2);
    }
    
    // Deuxième colonne
    if (data.workLog.personnel[i + halfLength]) {
      pdf.circle(margin + colWidth + 2, yPos + 1.5, 1, 'S');
      pdf.text(sanitizeText(data.workLog.personnel[i + halfLength]), margin + colWidth + 6, yPos + 2);
    }
    
    yPos += 5; // Réduire l'espacement entre les lignes
  }
  
  return yPos + 4; // Réduire l'espace après la section
}
