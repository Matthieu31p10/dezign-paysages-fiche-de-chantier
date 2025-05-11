
import { PDFData } from '../types';
import { drawInfoBox, pdfColors } from '../pdfHelpers';
import { formatWasteManagement } from '@/utils/format-helpers';

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Gestion des déchets - centré
  drawInfoBox(pdf, margin, yPos, contentWidth, 20, "Gestion des déchets", () => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatWasteManagement(data.workLog?.wasteManagement), margin + 5, yPos + 12);
  });
  
  return yPos + 25; // Réduire l'espace après cette section
};
