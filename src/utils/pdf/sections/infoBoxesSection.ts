
import { PDFData } from '../types';
import { drawInfoBox } from '../pdfHelpers';
import { getWasteManagementText } from '../pdfHelpers';

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Boîtes d'information sur une seule ligne avec hauteur réduite
  
  // Écart du temps et gestion des déchets sur la même ligne
  drawInfoBox(pdf, margin, yPos, contentWidth/2 - 5, 20, "Écart du temps de passage", () => {
    if (data.workLog && data.workLog.duration) {
      const totalTime = data.workLog.timeTracking?.totalHours || 0;
      const hourDiff = totalTime - data.workLog.duration;
      const sign = hourDiff >= 0 ? '+' : '';
      pdf.setTextColor(hourDiff < 0 ? 0 : 76, hourDiff < 0 ? 150 : 175, hourDiff < 0 ? 71 : 80);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${sign}${hourDiff.toFixed(2)} h`, margin + 5, yPos + 12);
      
      // Reset text color
      pdf.setTextColor(60, 60, 60);
    }
  });
  
  // Gestion des déchets
  const wasteBoxX = margin + contentWidth/2 + 5;
  drawInfoBox(pdf, wasteBoxX, yPos, contentWidth/2 - 5, 20, "Gestion des déchets", () => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(getWasteManagementText(data.workLog?.wasteManagement), wasteBoxX + 5, yPos + 12);
  });
  
  // Consommation d'eau sur la même ligne que l'arrosage (sera gérée dans wateringSection)
  
  return yPos + 25; // Réduire l'espace après cette section
}
