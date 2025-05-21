
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
    : themeInput;

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Initialize page coordinates
  let y = 20;

  // Add company and project header
  y = drawHeaderSection(doc, data, 20, y, theme);
  
  // Add info boxes (date, total hours, etc)
  if (pdfOptions.includeContactInfo !== false) {
    y = drawInfoBoxesSection(doc, data, 20, y, 170);
  }
  
  // Add project details
  y = drawDetailsSection(doc, workLog, project, y, theme);
  
  // Add personnel section
  if (pdfOptions.includePersonnel !== false && workLog.personnel?.length) {
    y = drawPersonnelSection(doc, data, 20, y);
  }
  
  // Add tasks section
  if (pdfOptions.includeTasks !== false && (workLog.tasks?.length || customTasks?.length)) {
    y = drawTasksSection(doc, data, 20, y, doc.internal.pageSize.width - 40, 170);
  }
  
  // Add watering section for water consumption
  if (pdfOptions.includeWatering !== false && workLog.waterConsumption) {
    y = drawWateringSection(doc, data, 20, y, 170);
  }
  
  // Add notes section
  if (pdfOptions.includeNotes !== false && workLog.notes) {
    y = drawNotesSection(doc, data, 20, y, 170);
  }
  
  // Add time tracking section
  if (pdfOptions.includeTimeTracking !== false) {
    y = drawTimeTrackingSection(doc, data, 20, y, 170);
  }
  
  // Add consumables section if present and requested
  if (pdfOptions.includeConsumables !== false && consumables?.length) {
    y = drawConsumablesSection(doc, data, 20, y, 170);
  }
  
  // Add summary section if requested
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
