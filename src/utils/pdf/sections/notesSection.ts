
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawNotesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeNotes || !data.workLog?.notes) {
    return yPos;
  }
  
  yPos += 8; // Réduire l'espace avant la section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Notes et observations", margin, yPos);
  
  yPos += 6; // Réduire l'espace
  
  // Encadré pour les notes - hauteur adaptative
  const sanitizedNotes = sanitizeText(data.workLog.notes);
  const maxWidth = contentWidth - 10;
  const splitNotes = pdf.splitTextToSize(sanitizedNotes, maxWidth);
  
  // Calculer la hauteur nécessaire sans limite de lignes
  const lineHeight = 4; // Hauteur de ligne réduite
  const boxHeight = Math.max(splitNotes.length * lineHeight + 10, 20); // Minimum height of 20mm
  
  pdf.setDrawColor(200, 200, 200);
  pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, 'S');
  
  pdf.setFontSize(9); // Taille de police réduite
  pdf.setFont('helvetica', 'normal');
  
  // Afficher toutes les notes sans limite de lignes
  for (let i = 0; i < splitNotes.length; i++) {
    pdf.text(splitNotes[i], margin + 5, yPos + 8 + (i * lineHeight));
  }
  
  return yPos + boxHeight + 3; // Espace adapté à la hauteur de la boîte
}
