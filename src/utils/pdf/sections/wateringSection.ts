
import { PDFData } from '../types';

export const drawWateringSection = (pdf: any, data: PDFData, margin: number, yPos: number): number => {
  if (!data.pdfOptions?.includeWatering) {
    return yPos;
  }
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Arrosage", margin, yPos);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const wateringStatus = 
    data.workLog?.tasksPerformed.watering === 'on' ? "Allumé" : 
    data.workLog?.tasksPerformed.watering === 'off' ? "Coupé" : 
    "Pas d'arrosage";
  
  pdf.text(wateringStatus, margin, yPos + 8);
  
  // Badge pour statut d'arrosage
  if (data.workLog?.tasksPerformed.watering !== 'none') {
    const textWidth = pdf.getTextWidth(wateringStatus);
    const badgeX = margin + textWidth + 5;
    const isOn = data.workLog?.tasksPerformed.watering === 'on';
    
    pdf.setFillColor(isOn ? 220 : 245, isOn ? 242 : 220, isOn ? 220 : 220);
    pdf.roundedRect(badgeX, yPos + 3, 30, 8, 2, 2, 'F');
    
    pdf.setFontSize(8);
    pdf.setTextColor(isOn ? 200 : 100, isOn ? 0 : 150, isOn ? 0 : 70);
    pdf.text(isOn ? "ACTIF" : "INACTIF", badgeX + 15, yPos + 8, { align: 'center' });
    pdf.setTextColor(60, 60, 60);
  }
  
  return yPos + 15;
}
