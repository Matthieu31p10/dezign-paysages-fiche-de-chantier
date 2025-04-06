
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
  
  // Calculer la hauteur nécessaire (mais limiter pour éviter de déborder de la page)
  const lineHeight = 4; // Hauteur de ligne réduite
  const maxLines = 8; // Maximum de lignes pour ne pas déborder
  const lines = splitNotes.slice(0, maxLines);
  const boxHeight = Math.min(lines.length * lineHeight + 10, 40);
  
  pdf.setDrawColor(200, 200, 200);
  pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, 'S');
  
  pdf.setFontSize(9); // Taille de police réduite
  pdf.setFont('helvetica', 'normal');
  
  // Afficher les notes avec un interligne réduit
  for (let i = 0; i < lines.length; i++) {
    pdf.text(lines[i], margin + 5, yPos + 8 + (i * lineHeight));
  }
  
  // Si le texte est tronqué, indiquer qu'il y a plus
  if (splitNotes.length > maxLines) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text("(...)", margin + 5, yPos + boxHeight - 3);
  }
  
  return yPos + boxHeight + 3; // Espace adapté à la hauteur de la boîte
}
