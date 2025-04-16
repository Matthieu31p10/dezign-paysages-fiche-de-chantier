
import { WorkLog } from '@/types/models';

interface FontSizes {
  normal: number;
  title: number;
  subtitle: number;
}

/**
 * Adds a financial summary section to the PDF
 */
export const addSummarySection = (pdf: any, workLog: WorkLog, yPos: number, margin: number, fontSizes: FontSizes): number => {
  // Start position
  const startY = yPos + 8;
  let currentY = startY;
  
  // Set font for the title
  pdf.setFontSize(fontSizes.title);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bilan Financier', margin, currentY);
  currentY += 10;
  
  // Set font for content
  pdf.setFontSize(fontSizes.normal);
  pdf.setFont('helvetica', 'normal');
  
  // Get data for calculations
  const hourlyRate = workLog.hourlyRate || 0;
  const totalHours = workLog.timeTracking?.totalHours || 0;
  const personnelCount = workLog.personnel?.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  const laborCost = totalTeamHours * hourlyRate;
  
  // Calculate consumables total
  const consumables = workLog.consumables || [];
  const totalConsumables = consumables.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  
  // Draw labor details
  pdf.text('Main d\'œuvre:', margin, currentY);
  pdf.text(`${totalTeamHours.toFixed(2)} heures x ${hourlyRate.toFixed(2)} € = ${laborCost.toFixed(2)} €`, margin + 60, currentY);
  currentY += 8;
  
  // Draw consumables if any
  if (consumables.length > 0) {
    pdf.text('Fournitures:', margin, currentY);
    pdf.text(`${totalConsumables.toFixed(2)} €`, margin + 60, currentY);
    currentY += 8;
  }
  
  // Draw total
  const totalAmount = laborCost + totalConsumables;
  pdf.setFontSize(fontSizes.subtitle);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total:', margin, currentY);
  pdf.text(`${totalAmount.toFixed(2)} €`, margin + 60, currentY);
  currentY += 12;
  
  // Add signed quote details if available
  if (workLog.signedQuoteAmount && workLog.signedQuoteAmount > 0) {
    pdf.setFontSize(fontSizes.normal);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Devis signé:', margin, currentY);
    pdf.text(`${workLog.signedQuoteAmount.toFixed(2)} €`, margin + 60, currentY);
    currentY += 8;
    
    const difference = workLog.signedQuoteAmount - totalAmount;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Différence:', margin, currentY);
    
    // Set color based on difference
    if (difference >= 0) {
      pdf.setTextColor(0, 128, 0); // Green for positive
    } else {
      pdf.setTextColor(255, 0, 0); // Red for negative
    }
    
    pdf.text(`${difference.toFixed(2)} €`, margin + 60, currentY);
    pdf.setTextColor(60, 60, 60); // Reset to default text color
    currentY += 12;
  }
  
  // Add invoice status if relevant
  if (workLog.invoiced !== undefined) {
    pdf.setFontSize(fontSizes.normal);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Statut:', margin, currentY);
    pdf.text(workLog.invoiced ? 'Facturé' : 'Non facturé', margin + 60, currentY);
    currentY += 8;
  }
  
  return currentY;
};
