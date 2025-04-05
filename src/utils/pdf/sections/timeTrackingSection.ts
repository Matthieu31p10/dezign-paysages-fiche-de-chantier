
import { PDFData } from '../types';
import { drawTimeBox } from '../pdfHelpers';

export const drawTimeTrackingSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeTimeTracking) {
    return yPos;
  }
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Suivi du temps", margin, yPos);
  
  yPos += 10;
  const timeBoxWidth = contentWidth / 3;
  
  // Départ
  drawTimeBox(pdf, margin, yPos, timeBoxWidth - 3, "Départ", data.workLog?.timeTracking?.departure || "--:--");
  
  // Arrivée
  drawTimeBox(pdf, margin + timeBoxWidth, yPos, timeBoxWidth - 3, "Arrivée", data.workLog?.timeTracking?.arrival || "--:--");
  
  // Heure de fin
  drawTimeBox(pdf, margin + timeBoxWidth * 2, yPos, timeBoxWidth - 3, "Heure de fin", data.workLog?.timeTracking?.end || data.endTime || "--:--");
  
  // Pause
  yPos += 25;
  drawTimeBox(pdf, margin, yPos, timeBoxWidth - 3, "Pause", data.workLog?.timeTracking?.breakTime || "00:00");
  
  return yPos + 30;
}
