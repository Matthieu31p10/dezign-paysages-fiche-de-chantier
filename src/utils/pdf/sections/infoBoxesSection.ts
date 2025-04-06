
import { PDFData } from '../types';
import { drawInfoBox } from '../pdfHelpers';
import { getWasteManagementText } from '../pdfHelpers';

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Gestion des déchets
  const wasteBoxX = margin + contentWidth/2 + 5;
  drawInfoBox(pdf, wasteBoxX, yPos, contentWidth/2 - 5, 20, "Gestion des déchets", () => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(getWasteManagementText(data.workLog?.wasteManagement), wasteBoxX + 5, yPos + 12);
  });
  
  return yPos + 25; // Réduire l'espace après cette section
}

