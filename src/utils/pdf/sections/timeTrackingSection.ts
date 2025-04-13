
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
  
  yPos += 25;
  
  // Financial information for blank worksheets
  if (data.workLog?.signedQuoteAmount && data.workLog.signedQuoteAmount > 0) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Informations financières", margin, yPos);
    yPos += 8;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const hourlyRate = data.workLog.hourlyRate || 0;
    const totalHours = data.workLog.timeTracking?.totalHours || 0;
    const personnelCount = data.workLog.personnel?.length || 1;
    const totalTeamHours = totalHours * personnelCount;
    const laborCost = totalTeamHours * hourlyRate;
    
    const consumables = data.workLog.consumables || [];
    const totalConsumables = consumables.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    
    const totalEstimate = laborCost + totalConsumables;
    const signedAmount = data.workLog.signedQuoteAmount;
    const difference = signedAmount - totalEstimate;
    
    // Draw a table for financial information
    const colWidths = [contentWidth * 0.4, contentWidth * 0.3, contentWidth * 0.3];
    
    // Header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, contentWidth, 7, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text("Description", margin + 3, yPos + 5);
    pdf.text("Montant", margin + colWidths[0] + 3, yPos + 5);
    pdf.text("Total", margin + colWidths[0] + colWidths[1] + 3, yPos + 5);
    yPos += 7;
    
    // Data rows
    pdf.setFont('helvetica', 'normal');
    pdf.text("Main d'œuvre", margin + 3, yPos + 5);
    pdf.text(`${laborCost.toFixed(2)} €`, margin + colWidths[0] + 3, yPos + 5);
    pdf.text("", margin + colWidths[0] + colWidths[1] + 3, yPos + 5);
    yPos += 7;
    
    pdf.text("Fournitures", margin + 3, yPos + 5);
    pdf.text(`${totalConsumables.toFixed(2)} €`, margin + colWidths[0] + 3, yPos + 5);
    pdf.text("", margin + colWidths[0] + colWidths[1] + 3, yPos + 5);
    yPos += 7;
    
    // Summary
    pdf.setFillColor(250, 250, 250);
    pdf.rect(margin, yPos, contentWidth, 7, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text("Total estimé", margin + 3, yPos + 5);
    pdf.text("", margin + colWidths[0] + 3, yPos + 5);
    pdf.text(`${totalEstimate.toFixed(2)} €`, margin + colWidths[0] + colWidths[1] + 3, yPos + 5);
    yPos += 7;
    
    pdf.text("Devis signé", margin + 3, yPos + 5);
    pdf.text(`${data.workLog.isQuoteSigned ? 'Oui' : 'Non'}`, margin + colWidths[0] + 3, yPos + 5);
    pdf.text(`${signedAmount.toFixed(2)} €`, margin + colWidths[0] + colWidths[1] + 3, yPos + 5);
    yPos += 7;
    
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, contentWidth, 7, 'F');
    pdf.text("Différence", margin + 3, yPos + 5);
    pdf.text("", margin + colWidths[0] + 3, yPos + 5);
    
    // Set color based on difference
    if (difference >= 0) {
      pdf.setTextColor(0, 128, 0); // Green for positive
    } else {
      pdf.setTextColor(255, 0, 0); // Red for negative
    }
    
    pdf.text(`${difference.toFixed(2)} €`, margin + colWidths[0] + colWidths[1] + 3, yPos + 5);
    pdf.setTextColor(0, 0, 0); // Reset to black
    
    yPos += 15;
  }
  
  return yPos; 
}
