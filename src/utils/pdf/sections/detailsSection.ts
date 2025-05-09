
import { PDFData } from '../types';
import { formatDate } from '../../date';
import { drawInfoBox } from '../pdfHelpers';
import { isBlankWorksheet } from '@/components/worksheets/form/utils/generateUniqueIds';

export const drawDetailsSection = (pdf: any, data: PDFData, margin: number, yPos: number, pageWidth: number, contentWidth: number): number => {
  // Titre du document et date - aligné à droite
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  
  // Si on a les informations du projet, on affiche le nom
  if (data.pdfOptions?.includeContactInfo && data.project) {
    pdf.text(data.project.name, pageWidth - margin, yPos, { align: 'right' });
  } else {
    // Use isBlankWorksheet function for consistency
    const sheetIsBlank = data.workLog?.projectId && isBlankWorksheet(data.workLog?.projectId);
    pdf.text(sheetIsBlank ? "Fiche Vierge" : "Fiche de suivi", pageWidth - margin, yPos, { align: 'right' });
  }
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  // Use isBlankWorksheet function for consistency
  const sheetIsBlank = data.workLog?.projectId && isBlankWorksheet(data.workLog?.projectId);
  pdf.text(`${sheetIsBlank ? 'Fiche Vierge' : 'Fiche de suivi'} du ${formatDate(data.workLog?.date)}`, pageWidth - margin, yPos + 6, { align: 'right' });
  
  // Ligne de séparation
  yPos += 10; // Réduire l'espace
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  
  // Section détails du passage
  yPos += 8; // Réduire l'espace
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Détails du passage", pageWidth / 2, yPos, { align: 'center' });
  
  // Zones pour les détails principaux
  yPos += 8; // Réduire l'espace
  
  // Première ligne: Date, Durée prévue, Temps total - plus compact
  // Colonne 1: Date
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Date", margin, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(formatDate(data.workLog?.date), margin, yPos + 6);
  
  // Colonne 2: Durée prévue
  const col2X = margin + contentWidth / 3;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Durée prévue", col2X, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  if (data.workLog) {
    pdf.text(`${data.workLog.duration || '0'} heures`, col2X, yPos + 6);
  }
  
  // Colonne 3: Temps total (équipe)
  const col3X = margin + (contentWidth * 2/3);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  // Pour les fiches vierges, afficher le total équipe (heures × nombre de personnel)
  const isBlankSheet = isBlankWorksheet(data.workLog?.projectId);
  
  if (isBlankSheet) {
    pdf.text("Temps total équipe", col3X, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const totalHours = data.workLog?.timeTracking?.totalHours || 0;
    const personnelCount = data.workLog?.personnel?.length || 1;
    const teamTotalHours = totalHours * personnelCount;
    pdf.text(`${teamTotalHours.toFixed(2)} heures (${totalHours.toFixed(2)}h × ${personnelCount})`, col3X, yPos + 6);
  } else {
    pdf.text("Temps total", col3X, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const totalTime = data.workLog?.timeTracking?.totalHours || 0;
    pdf.text(`${totalTime.toFixed(2)} heures`, col3X, yPos + 6);
  }
  
  return yPos + 12; // Réduire l'espace après cette section
}
