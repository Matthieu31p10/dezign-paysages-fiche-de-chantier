
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDFData } from './types';
import { drawHeaderSection } from './sections/headerSection';
import { drawDetailsSection } from './sections/detailsSection';
import { drawPersonnelSection } from './sections/personnelSection';
import { drawTasksSection } from './sections/tasksSection';
import { drawTimeTrackingSection } from './sections/timeTrackingSection';
import { drawNotesSection } from './sections/notesSection';
import { drawWateringSection } from './sections/wateringSection';
import { drawInfoBoxesSection } from './sections/infoBoxesSection';
import { drawConsumablesSection } from './sections/consumablesSection';
import { addSummarySection } from './sections/summarySection';
import { pdfColors } from './pdfHelpers';

/**
 * Generates a PDF document for a work log using a modular approach with section files
 * @param data The data to use for generating the PDF
 * @returns Filename of the generated PDF
 */
export const generateModernWorkLogPDF = (data: PDFData): string => {
  // Make sure we have a WorkLog object
  if (!data.workLog) {
    throw new Error('WorkLog data is required');
  }
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  
  // Starting position
  let yPos = margin;
  
  // Draw header section with company info and logo
  if (data.pdfOptions?.includeCompanyInfo) {
    yPos = drawHeaderSection(doc, data, margin, yPos);
  }
  
  // Draw project details section
  yPos = drawDetailsSection(doc, data, margin, yPos, pageWidth, contentWidth);
  
  // Draw personnel section
  if (data.pdfOptions?.includePersonnel) {
    yPos = drawPersonnelSection(doc, data, margin, yPos);
  }
  
  // Draw tasks section
  if (data.pdfOptions?.includeTasks && data.workLog.tasks) {
    yPos = drawTasksSection(doc, data, margin, yPos, pageWidth, contentWidth);
  }
  
  // Draw time tracking section
  if (data.pdfOptions?.includeTimeTracking) {
    yPos = drawTimeTrackingSection(doc, data, margin, yPos, contentWidth);
  }
  
  // Draw info boxes for waste management
  if (data.pdfOptions?.includeWasteManagement) {
    yPos = drawInfoBoxesSection(doc, data, margin, yPos, contentWidth);
  }
  
  // Draw watering section
  if (data.pdfOptions?.includeWatering) {
    yPos = drawWateringSection(doc, data, margin, yPos, contentWidth);
  }
  
  // Draw notes section
  if (data.pdfOptions?.includeNotes) {
    yPos = drawNotesSection(doc, data, margin, yPos, contentWidth);
  }
  
  // Draw consumables section
  if (data.pdfOptions?.includeConsumables) {
    yPos = drawConsumablesSection(doc, data, margin, yPos, contentWidth);
  }
  
  // Draw summary section
  if (data.pdfOptions?.includeSummary) {
    const fontSizes = { normal: 9, title: 12, subtitle: 10 };
    if (data.workLog) {
      yPos = addSummarySection(doc, data.workLog, yPos, margin, fontSizes);
    }
  }
  
  // Add footer with page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Page number
    doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 10);
    
    // Generation date
    const today = format(new Date(), 'dd/MM/yyyy', { locale: fr });
    doc.text(`Document généré le ${today}`, margin, doc.internal.pageSize.getHeight() - 10);
  }

  // Save the PDF with a consistent file name
  const fileName = `worklog-${data.workLog.id}.pdf`;
  
  // Handle different actions (download or print)
  if (data.action === 'print') {
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  } else {
    doc.save(fileName);
  }
  
  return fileName;
};
