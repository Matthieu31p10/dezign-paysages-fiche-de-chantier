import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';
import { formatWasteManagement } from '@/utils/format-helpers';

export const drawWasteManagementSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  const pdfOptions = data.pdfOptions || {};
  
  // Only draw waste management section if includeWasteManagement option is true and there's waste management data
  if (!pdfOptions.includeWasteManagement || !data.workLog?.wasteManagement || data.workLog.wasteManagement === 'none') {
    return yPos;
  }
  
  yPos += 8;
  
  // Add section title
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Gestion des déchets', margin, yPos);
  yPos += 8;
  
  // Add waste management info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const wasteInfo = formatWasteManagement(data.workLog.wasteManagement);
  pdf.text(`Type de collecte: ${sanitizeText(wasteInfo)}`, margin, yPos);
  yPos += 5;
  
  // Add environmental note
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Traitement selon les normes environnementales en vigueur', margin, yPos);
  yPos += 10;
  
  return yPos;
};