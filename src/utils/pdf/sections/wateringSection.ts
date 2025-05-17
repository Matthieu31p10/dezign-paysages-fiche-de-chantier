
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawWateringSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  const pdfOptions = data.pdfOptions || {};
  
  // Only draw watering section if includeWatering option is true and there's water consumption data
  if (!pdfOptions.includeWatering || !data.workLog?.waterConsumption) {
    return yPos;
  }
  
  // Add section title
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Consommation d\'eau', margin, yPos);
  yPos += 6;
  
  // Add water consumption info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Volume: ${data.workLog.waterConsumption} m³`, margin, yPos);
  yPos += 10;
  
  return yPos;
}
