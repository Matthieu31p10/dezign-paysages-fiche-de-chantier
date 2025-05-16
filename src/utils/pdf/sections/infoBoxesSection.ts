
import { PDFData } from '../types';
import { drawInfoBox, pdfColors } from '../pdfHelpers';
import { formatWasteManagement } from '@/utils/format-helpers';

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Gestion des déchets - centré
  drawInfoBox(pdf, margin, yPos, contentWidth, 25, "Gestion des déchets", () => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const wasteText = formatWasteManagement(data.workLog?.wasteManagement);
    
    // Add green accent for waste management if it's not "Aucun"
    if (wasteText !== 'Aucun') {
      pdf.setTextColor(61, 174, 43); // Green color for active waste management
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setTextColor(120, 120, 120); // Gray for no waste management
      pdf.setFont('helvetica', 'normal');
    }
    
    pdf.text(wasteText, margin + 5, yPos + 15);
    
    // Reset text color
    pdf.setTextColor(pdfColors.text[0], pdfColors.text[1], pdfColors.text[2]);
  });
  
  return yPos + 30; // More space after this section
};
