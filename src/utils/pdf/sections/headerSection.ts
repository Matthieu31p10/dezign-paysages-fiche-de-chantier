
import { PDFData, PDFTheme } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawHeaderSection = (
  pdf: any, 
  data: PDFData, 
  margin: number, 
  yPos: number,
  theme?: PDFTheme
): number => {
  const colors = theme?.colors || { 
    primary: [61, 90, 254], 
    text: [60, 60, 60], 
    secondary: [70, 128, 131] 
  };
  
  // Rectangle d'en-tête avec couleur d'arrière-plan subtile
  const headerHeight = 35;
  pdf.setFillColor(248, 250, 252); // Arrière-plan très clair
  pdf.setDrawColor(200, 200, 200); // Bordure gris clair
  pdf.roundedRect(margin, yPos, pdf.internal.pageSize.width - margin * 2, headerHeight, 2, 2, 'FD');
  
  // Logo et informations de l'entreprise
  if (data.pdfOptions?.includeCompanyInfo && data.companyInfo) {
    if (data.companyLogo) {
      try {
        // Logo optimisé pour l'en-tête
        const logoSize = 28;
        pdf.addImage(data.companyLogo, 'PNG', margin + 5, yPos + 3, logoSize, logoSize);
        
        // Informations de l'entreprise à côté du logo
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(sanitizeText(data.companyInfo.name), margin + logoSize + 10, yPos + 8);
        
        pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(sanitizeText(data.companyInfo.address || ''), margin + logoSize + 10, yPos + 14);
        
        // Contact sur une ligne
        const contactInfo = `Tél: ${sanitizeText(data.companyInfo.phone || '')} | Email: ${sanitizeText(data.companyInfo.email || '')}`;
        pdf.text(contactInfo, margin + logoSize + 10, yPos + 20);
        
      } catch (error) {
        console.error('Erreur lors de l\'ajout du logo:', error);
      }
    } else {
      // Sans logo, informations centrées dans l'en-tête
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(sanitizeText(data.companyInfo.name), margin + 5, yPos + 10);
      
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(sanitizeText(data.companyInfo.address || ''), margin + 5, yPos + 18);
      
      const contactInfo = `Tél: ${sanitizeText(data.companyInfo.phone || '')} | Email: ${sanitizeText(data.companyInfo.email || '')}`;
      pdf.text(contactInfo, margin + 5, yPos + 26);
    }
    
    // Informations du projet à droite
    if (data.project) {
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      
      const rightX = pdf.internal.pageSize.width - margin - 5;
      pdf.text('Chantier:', rightX, yPos + 8, { align: 'right' });
      
      pdf.setFont('helvetica', 'normal');
      const projectName = data.project.name || 'Non défini';
      // Limiter la longueur pour l'affichage
      const maxProjectLength = 30;
      const displayProject = projectName.length > maxProjectLength ? 
        projectName.substring(0, maxProjectLength) + '...' : projectName;
      pdf.text(displayProject, rightX, yPos + 14, { align: 'right' });
      
      if (data.project.address) {
        pdf.text(sanitizeText(data.project.address), rightX, yPos + 20, { align: 'right' });
      }
    }
  }
  
  // Reset des couleurs
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  return yPos + headerHeight + 8; // Espacement après l'en-tête
}
