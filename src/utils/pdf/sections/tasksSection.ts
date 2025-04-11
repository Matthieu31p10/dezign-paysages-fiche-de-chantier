
import { PDFData } from '../types';
import { sanitizeText, pdfColors } from '../pdfHelpers';

export const drawTasksSection = (pdf: any, data: PDFData, margin: number, yPos: number, pageWidth: number, contentWidth: number): number => {
  // Titre de la section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]);
  pdf.text('Tâches réalisées', margin, yPos + 10);
  
  // Réinitialiser la couleur du texte
  pdf.setTextColor(pdfColors.text[0], pdfColors.text[1], pdfColors.text[2]);
  
  // Augmenter la position verticale pour le contenu
  yPos += 15;
  
  // Rectangle de fond pour le contenu
  pdf.setFillColor(pdfColors.lightGrey[0], pdfColors.lightGrey[1], pdfColors.lightGrey[2]);
  pdf.setDrawColor(pdfColors.border[0], pdfColors.border[1], pdfColors.border[2]);
  pdf.roundedRect(margin, yPos, contentWidth, 40, 1, 1, 'FD');
  
  // Traitement du texte des tâches
  let tasksText = sanitizeText(data.workLog?.tasks || '');
  
  // S'assurer que le texte est lisible et ne contient pas de caractères HTML ou de code
  if (tasksText.includes('<') || tasksText.includes('>')) {
    // Tentative de nettoyage des balises HTML
    tasksText = tasksText.replace(/<[^>]*>/g, ' ');
  }
  
  // Créer un texte multiligne
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Calculer la hauteur du texte
  const splitText = pdf.splitTextToSize(tasksText, contentWidth - 10);
  const textHeight = splitText.length * 5; // 5mm par ligne
  
  // Ajuster la hauteur du rectangle si nécessaire
  const minHeight = 40;
  const neededHeight = Math.max(minHeight, textHeight + 10); // 10mm de marge
  
  // Redessiner le rectangle avec la hauteur ajustée
  pdf.setFillColor(pdfColors.lightGrey[0], pdfColors.lightGrey[1], pdfColors.lightGrey[2]);
  pdf.setDrawColor(pdfColors.border[0], pdfColors.border[1], pdfColors.border[2]);
  pdf.roundedRect(margin, yPos, contentWidth, neededHeight, 1, 1, 'FD');
  
  // Dessiner le texte
  pdf.text(splitText, margin + 5, yPos + 8);
  
  // Mise à jour de la position verticale
  yPos += neededHeight + 10;
  
  return yPos;
};
