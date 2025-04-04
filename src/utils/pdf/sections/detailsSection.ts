
import { PDFData } from '../types';
import { formatDate } from '../../date';
import { drawInfoBox } from '../pdfHelpers';

export const drawDetailsSection = (pdf: any, data: PDFData, margin: number, yPos: number, pageWidth: number, contentWidth: number): number => {
  // Titre du document et date
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  
  // Si on a les informations du projet, on affiche le nom
  if (data.pdfOptions?.includeContactInfo && data.project) {
    pdf.text(data.project.name, margin, yPos);
  } else {
    pdf.text("Fiche de suivi", margin, yPos);
  }
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Fiche de suivi du ${formatDate(data.workLog?.date)}`, margin, yPos + 7);
  
  // Ligne de séparation
  yPos += 12;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  
  // Section détails du passage
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Détails du passage", pageWidth / 2, yPos, { align: 'center' });
  
  // Zones pour les détails principaux
  yPos += 10;
  
  // Première ligne: Date, Durée prévue, Temps total
  const firstRowY = yPos;
  
  // Colonne 1: Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Date", margin, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(formatDate(data.workLog?.date), margin, yPos + 8);
  
  // Colonne 2: Durée prévue
  const col2X = margin + contentWidth / 3;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Durée prévue", col2X, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  if (data.workLog) {
    pdf.text(`${data.workLog.duration} heures`, col2X, yPos + 8);
  }
  
  // Colonne 3: Temps total (équipe)
  const col3X = margin + (contentWidth * 2/3);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Temps total (équipe)", col3X, yPos);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const totalTime = data.workLog?.timeTracking?.totalHours || 0;
  pdf.text(`${totalTime.toFixed(2)} heures`, col3X, yPos + 8);
  
  return yPos + 20;
}
