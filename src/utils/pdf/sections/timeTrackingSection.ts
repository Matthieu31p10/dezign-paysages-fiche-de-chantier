
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
  const timeBoxWidth = contentWidth / 4; // Réduire la largeur pour tenir 4 éléments par ligne
  
  // Première ligne: Départ, Arrivée, Fin, Pause (tous sur une seule ligne)
  drawTimeBox(pdf, margin, yPos, timeBoxWidth - 3, "Départ", data.workLog?.timeTracking?.departure || "--:--");
  drawTimeBox(pdf, margin + timeBoxWidth, yPos, timeBoxWidth - 3, "Arrivée", data.workLog?.timeTracking?.arrival || "--:--");
  drawTimeBox(pdf, margin + timeBoxWidth * 2, yPos, timeBoxWidth - 3, "Fin", data.workLog?.timeTracking?.end || data.endTime || "--:--");
  drawTimeBox(pdf, margin + timeBoxWidth * 3, yPos, timeBoxWidth - 3, "Pause", data.workLog?.timeTracking?.breakTime || "00:00");
  
  return yPos + 20; // Réduire l'espace vertical après cette section
}
