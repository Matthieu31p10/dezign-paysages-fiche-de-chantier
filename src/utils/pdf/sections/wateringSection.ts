
import { PDFData } from '../types';
import { drawInfoBox } from '../pdfHelpers';

export const drawWateringSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  if (!data.pdfOptions?.includeWatering) {
    return yPos;
  }
  
  yPos += 8; // Réduire l'espace avant cette section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Arrosage", margin, yPos);
  
  yPos += 8;
  
  // Afficher l'arrosage et la consommation d'eau sur la même ligne
  // Mettre à jour la première colonne pour arrosage
  drawInfoBox(pdf, margin, yPos, contentWidth/2 - 5, 20, "État de l'arrosage", () => {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const wateringState = data.workLog?.tasksPerformed?.watering || 'none';
    let wateringText = "Non effectué";
    
    if (wateringState === 'manual') {
      wateringText = "Manuel";
    } else if (wateringState === 'automatic') {
      wateringText = "Automatique";
    } else if (wateringState === 'both') {
      wateringText = "Manuel et automatique";
    }
    
    pdf.text(wateringText, margin + 5, yPos + 12);
  });
  
  // Consommation d'eau sur la même ligne
  const waterConsumptionX = margin + contentWidth/2 + 5;
  drawInfoBox(pdf, waterConsumptionX, yPos, contentWidth/2 - 5, 20, "Consommation d'eau", () => {
    if (data.workLog?.waterConsumption) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${data.workLog.waterConsumption} m³`, waterConsumptionX + 5, yPos + 12);
    } else {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text("Non renseigné", waterConsumptionX + 5, yPos + 12);
    }
  });
  
  return yPos + 25; // Réduire l'espace après la section
}
