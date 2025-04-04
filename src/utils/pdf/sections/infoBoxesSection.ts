
import { PDFData } from '../types';
import { drawInfoBox } from '../pdfHelpers';
import { getWasteManagementText } from '../pdfHelpers';

export const drawInfoBoxesSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Écart du temps
  drawInfoBox(pdf, margin, yPos, contentWidth/2 - 5, 25, "Écart du temps de passage", () => {
    if (data.workLog && data.workLog.duration) {
      const totalTime = data.workLog.timeTracking?.totalHours || 0;
      const hourDiff = totalTime - data.workLog.duration;
      const sign = hourDiff >= 0 ? '+' : '';
      pdf.setTextColor(hourDiff < 0 ? 0 : 76, hourDiff < 0 ? 150 : 175, hourDiff < 0 ? 71 : 80);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${sign}${hourDiff.toFixed(2)} h`, margin + 5, yPos + 12);
      
      // Reset text color
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Durée prévue - (heures effectuées / nombre de passages)`, margin + 5, yPos + 20);
    }
  });
  
  // Gestion des déchets
  const wasteBoxX = margin + contentWidth/2 + 5;
  drawInfoBox(pdf, wasteBoxX, yPos, contentWidth/2 - 5, 25, "Gestion des déchets", () => {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(getWasteManagementText(data.workLog?.wasteManagement), wasteBoxX + 5, yPos + 15);
  });
  
  // Consommation d'eau
  yPos += 35;
  drawInfoBox(pdf, margin, yPos, contentWidth, 20, "Consommation d'eau", () => {
    if (data.workLog?.waterConsumption) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${data.workLog.waterConsumption} m³`, margin + 5, yPos + 14);
    } else {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text("Non renseigné", margin + 5, yPos + 14);
    }
  });
  
  return yPos + 30;
}
