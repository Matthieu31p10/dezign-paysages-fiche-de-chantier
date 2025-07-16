
import jsPDF from 'jspdf';
import { PDFData, PDFTheme } from './types';
import { getTheme } from './themes/pdfThemes';
import { drawHeaderSection } from './sections/headerSection';
import { drawInfoBoxesSection } from './sections/infoBoxesSection';
import { drawDetailsSection } from './sections/detailsSection';
import { drawPersonnelSection } from './sections/personnelSection';
import { drawTasksSection } from './sections/tasksSection';
import { drawWateringSection } from './sections/wateringSection';
import { drawNotesSection } from './sections/notesSection';
import { drawTimeTrackingSection } from './sections/timeTrackingSection';
import { drawConsumablesSection } from './sections/consumablesSection';
import { addSummarySection } from './sections/summarySection';
import { saveAs } from 'file-saver';

export const generateModernWorkLogPDF = (data: PDFData): string => {
  // Extract data
  const {
    workLog,
    project,
    companyInfo,
    companyLogo,
    pdfOptions = {},
    customTasks,
    hourlyRate,
    consumables,
    vatRate,
    signedQuote,
    quoteValue,
    action = 'download',
    theme: themeInput
  } = data;

  if (!workLog) {
    throw new Error('No worklog data provided');
  }

  // Get theme
  const theme = typeof themeInput === 'string' 
    ? getTheme(themeInput) 
    : themeInput || getTheme();

  // Create PDF document optimized for A4 portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // A4 dimensions: 210mm x 297mm
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margins = { top: 15, bottom: 15, left: 15, right: 15 };
  const contentWidth = pageWidth - margins.left - margins.right;

  // Initialize page coordinates with optimized margins
  let y = margins.top;

  // Déterminer si c'est une fiche vierge
  const isBlankWorksheet = workLog.projectId?.startsWith('blank-') || workLog.projectId?.startsWith('DZFV');
  
  // Titre principal uniforme
  doc.setFont(theme.fonts.title.family, theme.fonts.title.style);
  doc.setFontSize(16);
  doc.setTextColor(theme.colors.primary[0], theme.colors.primary[1], theme.colors.primary[2]);
  const title = isBlankWorksheet ? 'FICHE VIERGE D\'INTERVENTION' : 'FICHE DE SUIVI D\'INTERVENTION';
  doc.text(title, pageWidth / 2, y + 5, { align: 'center' });
  y += 15;

  // Add company and project header with optimized spacing
  y = drawHeaderSection(doc, data, margins.left, y, theme);
  
  // Vérifier si nouvelle page nécessaire
  if (y > pageHeight - 50) {
    doc.addPage();
    y = margins.top;
  }
  
  // Add info boxes (date, total hours, etc) with full content width
  if (pdfOptions.includeContactInfo !== false) {
    y = drawInfoBoxesSection(doc, data, margins.left, y, contentWidth);
  }
  
  // Add project details with consistent layout
  y = drawDetailsSection(doc, workLog, project, y, theme);
  
  // Vérifier si nouvelle page nécessaire
  if (y > pageHeight - 80) {
    doc.addPage();
    y = margins.top;
  }
  
  // Add personnel section with optimized spacing
  if (pdfOptions.includePersonnel !== false && workLog.personnel?.length) {
    y = drawPersonnelSection(doc, data, margins.left, y);
  }
  
  // Add tasks section with full content width
  if (pdfOptions.includeTasks !== false && (workLog.tasks?.length || customTasks?.length)) {
    y = drawTasksSection(doc, data, margins.left, y, contentWidth, contentWidth);
  }
  
  // Add watering section for water consumption
  if (pdfOptions.includeWatering !== false && workLog.waterConsumption) {
    y = drawWateringSection(doc, data, margins.left, y, contentWidth);
  }
  
  // Add notes section with better formatting
  if (pdfOptions.includeNotes !== false && workLog.notes) {
    y = drawNotesSection(doc, data, margins.left, y, contentWidth);
  }
  
  // Vérifier si nouvelle page nécessaire avant le suivi du temps
  if (y > pageHeight - 60) {
    doc.addPage();
    y = margins.top;
  }
  
  // Add time tracking section with improved layout
  if (pdfOptions.includeTimeTracking !== false) {
    y = drawTimeTrackingSection(doc, data, margins.left, y, contentWidth);
  }
  
  // Add consumables section if present and requested
  if (pdfOptions.includeConsumables !== false && consumables?.length) {
    y = drawConsumablesSection(doc, data, margins.left, y, contentWidth);
  }
  
  // Add summary section if requested with consistent styling
  if (pdfOptions.includeSummary !== false && (hourlyRate || (workLog.timeTracking && workLog.timeTracking.totalHours))) {
    y = addSummarySection(doc, {
      hourlyRate,
      totalHours: workLog.timeTracking?.totalHours || 0,
      taxRate: vatRate,
      signedQuote,
      quoteValue
    }, y, theme);
  }

  // Generate filename
  const formattedDate = workLog.date 
    ? new Date(workLog.date).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  
  const projectName = project?.name 
    ? project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() 
    : 'projet';
  
  const filename = `fiche_suivi_${projectName}_${formattedDate}.pdf`;

  // Handle output based on action
  if (action === 'download') {
    const blob = doc.output('blob');
    saveAs(blob, filename);
  } else {
    doc.autoPrint();
    window.open(doc.output('bloburl'));
  }

  return filename;
};
