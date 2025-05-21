
import jsPDF from 'jspdf';
import { WorkLog, ProjectInfo, CompanyInfo } from '@/types/models';
import { PDFData, PDFOptions, PDFTheme } from './types';
import { getTheme } from './themes/pdfThemes';
import { addHeaderSection } from './sections/headerSection';
import { addInfoBoxesSection } from './sections/infoBoxesSection';
import { addDetailsSection } from './sections/detailsSection';
import { addPersonnelSection } from './sections/personnelSection';
import { addTasksSection } from './sections/tasksSection';
import { addWateringSection } from './sections/wateringSection';
import { addNotesSection } from './sections/notesSection';
import { addTimeTrackingSection } from './sections/timeTrackingSection';
import { addConsumablesSection } from './sections/consumablesSection';
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
  y = addHeaderSection(doc, workLog, companyInfo, companyLogo, project, theme);
  
  // Add info boxes (date, total hours, etc)
  if (pdfOptions.includeContactInfo !== false) {
    y = addInfoBoxesSection(doc, workLog, project, y, theme);
  }
  
  // Add project details
  y = addDetailsSection(doc, workLog, project, y, theme);
  
  // Add personnel section
  if (pdfOptions.includePersonnel !== false && workLog.personnel?.length) {
    y = addPersonnelSection(doc, workLog.personnel, y, theme);
  }
  
  // Add tasks section
  if (pdfOptions.includeTasks !== false && (workLog.tasks?.length || customTasks?.length)) {
    y = addTasksSection(doc, workLog.tasks || [], customTasks || [], y, theme);
  }
  
  // Add watering section
  if (pdfOptions.includeWatering !== false && workLog.watering) {
    y = addWateringSection(doc, workLog.watering, y, theme);
  }
  
  // Add notes section
  if (pdfOptions.includeNotes !== false && workLog.notes) {
    y = addNotesSection(doc, workLog.notes, y, theme);
  }
  
  // Add time tracking section
  if (pdfOptions.includeTimeTracking !== false) {
    y = addTimeTrackingSection(doc, workLog, y, theme);
  }
  
  // Add consumables section if present and requested
  if (pdfOptions.includeConsumables !== false && consumables?.length) {
    y = addConsumablesSection(doc, consumables, y, theme);
  }
  
  // Add summary section if requested
  if (pdfOptions.includeSummary !== false && (hourlyRate || workLog.totalHours)) {
    y = addSummarySection(doc, {
      hourlyRate,
      totalHours: workLog.totalHours,
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
