
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawPersonnelSection = (pdf: any, data: PDFData, margin: number, yPos: number): number => {
  if (!data.pdfOptions?.includePersonnel || !data.workLog?.personnel || data.workLog.personnel.length === 0) {
    return yPos;
  }
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Personnel présent", margin, yPos);
  
  // Liste du personnel
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  data.workLog.personnel.forEach((person, index) => {
    // Draw a small icon for each person
    pdf.setDrawColor(150, 150, 150);
    pdf.circle(margin + 3, yPos + 2, 1.5, 'S');
    
    pdf.text(sanitizeText(person), margin + 8, yPos + 3);
    yPos += 6;
  });
  
  return yPos + 6;
}
