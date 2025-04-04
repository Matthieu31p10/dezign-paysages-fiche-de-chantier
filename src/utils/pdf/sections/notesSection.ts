
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawNotesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeNotes || !data.workLog?.notes) {
    return yPos;
  }
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Notes et observations", margin, yPos);
  
  yPos += 8;
  
  // Encadré pour les notes
  pdf.setDrawColor(200, 200, 200);
  pdf.roundedRect(margin, yPos, contentWidth, 40, 2, 2, 'S');
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  const sanitizedNotes = sanitizeText(data.workLog.notes);
  const splitNotes = pdf.splitTextToSize(sanitizedNotes, contentWidth - 10);
  
  // Limiter le nombre de lignes affichées
  const maxLines = 10;
  const truncatedNotes = splitNotes.slice(0, maxLines);
  
  pdf.text(truncatedNotes, margin + 5, yPos + 6);
  
  // Si le texte est tronqué, indiquer qu'il y a plus
  if (splitNotes.length > maxLines) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text("(...)", margin + 5, yPos + 38);
  }
  
  return yPos;
}
