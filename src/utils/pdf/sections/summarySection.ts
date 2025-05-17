
import { WorkLog } from '@/types/models';
import { PDFTheme } from '../types';

/**
 * Adds a financial summary section to the PDF
 */
export const addSummarySection = (
  pdf: any, 
  workLog: WorkLog, 
  yPos: number, 
  margin: number, 
  theme?: PDFTheme
): number => {
  const fonts = theme?.fonts || {
    normal: { size: 9, family: 'helvetica', style: 'normal' },
    title: { size: 12, family: 'helvetica', style: 'bold' },
    subtitle: { size: 10, family: 'helvetica', style: 'bold' }
  };
  
  const colors = theme?.colors || {
    primary: [61, 90, 254],
    text: [60, 60, 60]
  };
  
  // Start position
  const startY = yPos + 8;
  let currentY = startY;
  
  // Set font for the title
  pdf.setFontSize(fonts.title.size);
  pdf.setFont(fonts.title.family, fonts.title.style);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text('Bilan Financier', margin, currentY);
  currentY += 10;
  
  // Reset text color
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Set font for content
  pdf.setFontSize(fonts.normal.size);
  pdf.setFont(fonts.normal.family, fonts.normal.style);
  
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
  pdf.setFontSize(fonts.subtitle.size);
  pdf.setFont(fonts.subtitle.family, fonts.subtitle.style);
  pdf.text('Total:', margin, currentY);
  pdf.text(`${totalAmount.toFixed(2)} €`, margin + 60, currentY);
  currentY += 12;
  
  // Add signed quote details if available
  if (workLog.signedQuoteAmount && workLog.signedQuoteAmount > 0) {
    pdf.setFontSize(fonts.normal.size);
    pdf.setFont(fonts.normal.family, fonts.normal.style);
    pdf.text('Devis signé:', margin, currentY);
    pdf.text(`${workLog.signedQuoteAmount.toFixed(2)} €`, margin + 60, currentY);
    currentY += 8;
    
    const difference = workLog.signedQuoteAmount - totalAmount;
    pdf.setFont(fonts.normal.family, 'bold');
    pdf.text('Différence:', margin, currentY);
    
    // Set color based on difference
    if (difference >= 0) {
      pdf.setTextColor(0, 128, 0); // Green for positive
    } else {
      pdf.setTextColor(255, 0, 0); // Red for negative
    }
    
    pdf.text(`${difference.toFixed(2)} €`, margin + 60, currentY);
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]); // Reset to default text color
    currentY += 12;
  }
  
  // Add invoice status if relevant
  if (workLog.invoiced !== undefined) {
    pdf.setFontSize(fonts.normal.size);
    pdf.setFont(fonts.normal.family, fonts.normal.style);
    pdf.text('Statut:', margin, currentY);
    pdf.text(workLog.invoiced ? 'Facturé' : 'Non facturé', margin + 60, currentY);
    currentY += 8;
  }
  
  return currentY;
};
