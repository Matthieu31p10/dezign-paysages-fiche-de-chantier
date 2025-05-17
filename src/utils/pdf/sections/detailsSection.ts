
import { PDFData, PDFTheme } from '../types';
import { formatDate } from '../../date';
import { drawInfoBox } from '../pdfHelpers';
import { isBlankWorksheet } from '@/components/worksheets/form/utils/generateUniqueIds';

export const drawDetailsSection = (
  pdf: any, 
  data: PDFData, 
  margin: number, 
  yPos: number, 
  pageWidth: number, 
  contentWidth: number,
  theme?: PDFTheme
): number => {
  const colors = theme?.colors || { primary: [61, 90, 254], text: [60, 60, 60] };
  const fonts = theme?.fonts || {
    title: { size: 14, family: 'helvetica', style: 'bold' },
    body: { size: 11, family: 'helvetica', style: 'normal' },
    small: { size: 9, family: 'helvetica', style: 'bold' }
  };
  
  // Titre du document et date - aligné à droite
  pdf.setFontSize(fonts.title.size);
  pdf.setFont(fonts.title.family, fonts.title.style);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  
  // Si on a les informations du projet, on affiche le nom
  if (data.pdfOptions?.includeContactInfo && data.project) {
    pdf.text(data.project.name, pageWidth - margin, yPos, { align: 'right' });
  } else {
    // Use isBlankWorksheet function for consistency
    const sheetIsBlank = data.workLog?.projectId && isBlankWorksheet(data.workLog?.projectId);
    pdf.text(sheetIsBlank ? "Fiche Vierge" : "Fiche de suivi", pageWidth - margin, yPos, { align: 'right' });
  }
  
  pdf.setFontSize(fonts.body.size);
  pdf.setFont(fonts.body.family, fonts.body.style);
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Use isBlankWorksheet function for consistency
  const sheetIsBlank = data.workLog?.projectId && isBlankWorksheet(data.workLog?.projectId);
  pdf.text(`${sheetIsBlank ? 'Fiche Vierge' : 'Fiche de suivi'} du ${formatDate(data.workLog?.date)}`, pageWidth - margin, yPos + 6, { align: 'right' });
  
  // Ligne de séparation
  yPos += 10; // Réduire l'espace
  pdf.setDrawColor(theme?.colors.border[0] || 200, theme?.colors.border[1] || 200, theme?.colors.border[2] || 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  
  // Section détails du passage
  yPos += 8; // Réduire l'espace
  pdf.setFontSize(fonts.subtitle?.size || 12);
  pdf.setFont(fonts.subtitle?.family || 'helvetica', fonts.subtitle?.style || 'bold');
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text("Détails du passage", pageWidth / 2, yPos, { align: 'center' });
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Zones pour les détails principaux
  yPos += 8; // Réduire l'espace
  
  // Première ligne: Date, Durée prévue, Temps total - plus compact
  // Colonne 1: Date
  pdf.setFontSize(fonts.small.size);
  pdf.setFont(fonts.small.family, fonts.small.style);
  pdf.text("Date", margin, yPos);
  
  pdf.setFont(fonts.body.family, fonts.body.style);
  pdf.setFontSize(fonts.body.size);
  pdf.text(formatDate(data.workLog?.date), margin, yPos + 6);
  
  // Colonne 2: Durée prévue
  const col2X = margin + contentWidth / 3;
  pdf.setFontSize(fonts.small.size);
  pdf.setFont(fonts.small.family, fonts.small.style);
  pdf.text("Durée prévue", col2X, yPos);
  
  pdf.setFont(fonts.body.family, fonts.body.style);
  pdf.setFontSize(fonts.body.size);
  if (data.workLog) {
    pdf.text(`${data.workLog.duration || '0'} heures`, col2X, yPos + 6);
  }
  
  // Colonne 3: Temps total (équipe)
  const col3X = margin + (contentWidth * 2/3);
  pdf.setFontSize(fonts.small.size);
  pdf.setFont(fonts.small.family, fonts.small.style);
  
  // Pour les fiches vierges, afficher le total équipe (heures × nombre de personnel)
  const isBlankSheet = isBlankWorksheet(data.workLog?.projectId);
  
  if (isBlankSheet) {
    pdf.text("Temps total équipe", col3X, yPos);
    
    pdf.setFont(fonts.body.family, fonts.body.style);
    pdf.setFontSize(fonts.body.size);
    const totalHours = data.workLog?.timeTracking?.totalHours || 0;
    const personnelCount = data.workLog?.personnel?.length || 1;
    const teamTotalHours = totalHours * personnelCount;
    pdf.text(`${teamTotalHours.toFixed(2)} heures (${totalHours.toFixed(2)}h × ${personnelCount})`, col3X, yPos + 6);
  } else {
    pdf.text("Temps total", col3X, yPos);
    
    pdf.setFont(fonts.body.family, fonts.body.style);
    pdf.setFontSize(fonts.body.size);
    const totalTime = data.workLog?.timeTracking?.totalHours || 0;
    pdf.text(`${totalTime.toFixed(2)} heures`, col3X, yPos + 6);
  }
  
  return yPos + 12; // Réduire l'espace après cette section
}
