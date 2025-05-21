
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

  // Set up colors and fonts
  const textColor = colors.text || [60, 60, 60];
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Set initial Y position
  let y = startY;

  // Add details header
  doc.setFont(fonts.title.family, fonts.title.style);
  doc.setFontSize(fonts.title.size);
  doc.text('Détails de l\'intervention', spacing.margin, y);
  y += 8;

  // Setup for detail items
  doc.setFont(fonts.body.family, fonts.body.style);
  doc.setFontSize(fonts.body.size);

  // Create detail items grid
  const margin = spacing.margin;
  const colWidth = (doc.internal.pageSize.width - margin * 2) / 3;

  // Row 1: Date, Type, Météo
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Date:', margin, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(formatDate(workLog.date || ''), margin + 25, y);
  
  // Get type safely (this field might not exist on all worklogs)
  const workLogType = (workLog as any).type || 'Standard';
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Type:', margin + colWidth, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(workLogType, margin + colWidth + 25, y);
  
  // Get weather safely (this field might not exist on all worklogs)
  const workLogWeather = (workLog as any).weather || 'Non spécifiée';
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Météo:', margin + colWidth * 2, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(workLogWeather, margin + colWidth * 2 + 25, y);
  
  y += spacing.paragraphGap;

  // Row 2: Durée prévue, Temps total effectif - handle optional fields safely
  const plannedDuration = (workLog as any).plannedDuration;
  if (plannedDuration) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Durée prévue:', margin, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(`${plannedDuration} h`, margin + 25, y);
  }
  
  const totalHours = workLog.totalHours || 0;
  if (totalHours) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Temps total:', margin + colWidth, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(`${totalHours} h`, margin + colWidth + 25, y);
  }

  return y + spacing.sectionGap;
};
