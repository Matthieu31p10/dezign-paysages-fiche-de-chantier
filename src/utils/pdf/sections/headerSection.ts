
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawHeaderSection = (pdf: any, data: PDFData, margin: number, yPos: number): number => {
  // Logo de l'entreprise et informations
  if (data.pdfOptions?.includeCompanyInfo && data.companyInfo) {
    if (data.companyLogo) {
      try {
        // Increased logo size from 25 to 40
        pdf.addImage(data.companyLogo, 'PNG', margin, yPos, 40, 40);
        
        // Adjust text position to align with larger logo
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(sanitizeText(data.companyInfo.name), margin + 45, yPos + 5);
        pdf.text(sanitizeText(data.companyInfo.address || ''), margin + 45, yPos + 10);
        pdf.text(`Tél: ${sanitizeText(data.companyInfo.phone || '')}`, margin + 45, yPos + 15);
        pdf.text(`Email: ${sanitizeText(data.companyInfo.email || '')}`, margin + 45, yPos + 20);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du logo:', error);
      }
    } else {
      // Sans logo, afficher les informations de l'entreprise en haut
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(sanitizeText(data.companyInfo.name), margin, yPos + 8);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(sanitizeText(data.companyInfo.address || ''), margin, yPos + 14);
      pdf.text(`Tél: ${sanitizeText(data.companyInfo.phone || '')}`, margin, yPos + 20);
      pdf.text(`Email: ${sanitizeText(data.companyInfo.email || '')}`, margin, yPos + 26);
    }
  }
  
  return yPos + 45; // Increased return height to accommodate larger logo
}
