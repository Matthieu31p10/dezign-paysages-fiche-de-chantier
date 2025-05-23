
import jsPDF from 'jspdf';
import { WorkLog, ProjectInfo } from '@/types/models';
import { formatDate } from '../formatHelpers';
import { PDFTheme } from '../types';

export const drawDetailsSection = (
  doc: jsPDF,
  workLog: WorkLog,
  project?: ProjectInfo,
  startY: number = 60,
  theme?: PDFTheme
): number => {
  const defaultTheme = {
    fonts: {
      title: { size: 14, family: 'helvetica', style: 'bold' },
      body: { size: 10, family: 'helvetica', style: 'normal' },
      small: { size: 8, family: 'helvetica', style: 'normal' },
    },
    colors: {
      primary: [0, 100, 0],
      text: [60, 60, 60],
      lightText: [100, 100, 100],
      background: [255, 255, 255],
      lightGrey: [240, 240, 240],
      border: [200, 200, 200],
    },
    spacing: {
      margin: 20,
      sectionGap: 15,
      paragraphGap: 8,
    },
  };

  const { fonts, colors, spacing } = theme || defaultTheme;

  // Configurer les couleurs et les polices
  const textColor = colors.text || [60, 60, 60];
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Définir la position Y initiale
  let y = startY;

  // Ajouter l'en-tête des détails
  doc.setFont(fonts.title.family, fonts.title.style);
  doc.setFontSize(fonts.title.size);
  doc.text('Détails de l\'intervention', spacing.margin, y);
  y += 8;

  // Configuration pour les éléments de détail
  doc.setFont(fonts.body.family, fonts.body.style);
  doc.setFontSize(fonts.body.size);

  // Créer une grille d'éléments de détail
  const margin = spacing.margin;
  const colWidth = (doc.internal.pageSize.width - margin * 2) / 3;

  // Ligne 1 : Date, Type, Météo
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Date:', margin, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(formatDate(workLog.date || ''), margin + 25, y);
  
  // Obtenir le type en toute sécurité - vérifier s'il existe sur le workLog ou utiliser une valeur par défaut
  const workLogType = (workLog as any).type || 'Standard';
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Type:', margin + colWidth, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(workLogType, margin + colWidth + 25, y);
  
  // Obtenir la météo en toute sécurité - vérifier si elle existe sur le workLog ou utiliser une valeur par défaut
  const workLogWeather = (workLog as any).weather || 'Non spécifiée';
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Météo:', margin + colWidth * 2, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(workLogWeather, margin + colWidth * 2 + 25, y);
  
  y += spacing.paragraphGap;

  // Ligne 2 : Durée prévue, Temps total effectif - gérer les champs optionnels en toute sécurité
  const duration = workLog.duration || 0;
  if (duration) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Durée prévue:', margin, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(`${duration} h`, margin + 25, y);
  }
  
  const totalHours = workLog.timeTracking?.totalHours || 0;
  if (totalHours) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Temps total:', margin + colWidth, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(`${totalHours} h`, margin + colWidth + 25, y);
  }

  return y + spacing.sectionGap;
};
