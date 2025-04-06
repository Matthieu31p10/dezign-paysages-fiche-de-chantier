
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawWateringSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeWatering) {
    return yPos;
  }
  
  yPos += 8; // Réduire l'espace avant cette section
  
  // En-tête de la section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Arrosage et consommation d'eau", margin, yPos);
  
  yPos += 8;
  
  // Arrosage (plus compact)
  const wateringWidth = contentWidth / 2 - 5;
  
  // Rectangle de fond pour l'arrosage
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(220, 220, 220);
  pdf.roundedRect(margin, yPos, wateringWidth, 20, 2, 2, 'FD');
  
  // Titre pour l'arrosage
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text("Arrosage", margin + 5, yPos + 6);
  
  // Statut de l'arrosage
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  
  let wateringStatus = "Pas d'arrosage";
  if (data.workLog?.tasksPerformed?.watering === 'on') {
    wateringStatus = "Allumé";
  } else if (data.workLog?.tasksPerformed?.watering === 'off') {
    wateringStatus = "Coupé";
  }
  
  pdf.text(wateringStatus, margin + 5, yPos + 16);
  
  // Consommation d'eau (à droite de l'arrosage)
  const waterConsumptionX = margin + contentWidth/2 + 5;
  
  // Rectangle de fond pour la consommation d'eau
  pdf.setFillColor(245, 245, 245);
  pdf.setDrawColor(220, 220, 220);
  pdf.roundedRect(waterConsumptionX, yPos, wateringWidth, 20, 2, 2, 'FD');
  
  // Titre pour la consommation d'eau
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 100, 100);
  pdf.text("Consommation d'eau", waterConsumptionX + 5, yPos + 6);
  
  // Valeur de consommation d'eau
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  
  const waterConsumption = data.workLog?.waterConsumption 
    ? `${data.workLog.waterConsumption} m³` 
    : "Non renseigné";
    
  pdf.text(waterConsumption, waterConsumptionX + 5, yPos + 16);
  
  return yPos + 25; // Réduire l'espace après cette section
}
