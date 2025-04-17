
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { WorkLog } from '@/types/models';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDFData } from './types';

// Function to format a date
const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
};

// Function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};

// Updated function signature to receive PDFData and return a file name
export const generateWorkLogPDF = (data: PDFData): string => {
  // Make sure we have a WorkLog object
  if (!data.workLog) {
    throw new Error('WorkLog data is required');
  }
  
  const workLog = data.workLog;
  const doc = new jsPDF();

  // Define margins and starting Y position
  const margin = 10;
  let y = margin;

  // Function to add a styled header
  const addHeader = (text: string) => {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 8;
  };

  // Function to add a section title
  const addSectionTitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 6;
  };

  // Function to add a key-value pair
  const addKeyValuePair = (key: string, value: string | number | boolean | null | undefined) => {
    if (value === null || value === undefined) return;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${key}:`, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), margin + 25, y);
    y += 5;
  };

  // Function to create info boxes section
  const infoBoxesSection = (doc: jsPDF, workLog: WorkLog, y: number, options: any) => {
    const { margin } = options;
    const boxWidth = (doc.internal.pageSize.getWidth() - 4 * margin) / 3;
    const boxHeight = 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Box 1: Client Name and Address
    doc.rect(margin, y, boxWidth, boxHeight);
    doc.text(`Client: ${workLog.clientName || 'N/A'}`, margin + 2, y + 5);
    doc.text(`Address: ${workLog.address || 'N/A'}`, margin + 2, y + 10);

    // Box 2: Date and Team
    const x2 = margin + boxWidth + margin;
    doc.rect(x2, y, boxWidth, boxHeight);
    doc.text(`Date: ${formatDate(workLog.date)}`, x2 + 2, y + 5);
    // Fix the teamFilter property access since it doesn't exist on WorkLog type
    // Use linkedProjectId instead or another appropriate property
    doc.text(`Team: ${workLog.linkedProjectId ? 'Project Linked' : 'N/A'}`, x2 + 2, y + 10);

    // Box 3: Project ID
    const x3 = x2 + boxWidth + margin;
    doc.rect(x3, y, boxWidth, boxHeight);
    doc.text(`Project ID: ${workLog.projectId || 'N/A'}`, x3 + 2, y + 5);

    return y + boxHeight + margin;
  };

  // Function to create details section
  const detailsSection = (doc: jsPDF, workLog: WorkLog, y: number, options: any, label: string, value: string) => {
    const { margin } = options;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const textLines = doc.splitTextToSize(value, maxWidth - 30);
    doc.text(textLines, margin + 30, y);
    y += textLines.length * 5 + margin;
    return y;
  };

  // Function to create consumables table
  const consumablesTable = (doc: jsPDF, workLog: WorkLog, y: number, options: any) => {
    const { margin } = options;
    addSectionTitle('Consumables Used');
    const tableColumn = ['Product', 'Quantity', 'Unit Price', 'Total Price'];
    const tableRows: string[][] = [];

    workLog.consumables?.forEach(consumable => {
      tableRows.push([
        consumable.product || 'N/A',
        String(consumable.quantity || 0),
        formatCurrency(consumable.unitPrice || 0),
        formatCurrency(consumable.totalPrice || 0),
      ]);
    });

    // Use the AutoTable plugin through typecasting to access autoTable method
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: y,
      margin: { left: margin, right: margin },
      didParseCell: function (data: any) {
        if (data.section === 'head') {
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'normal');
        }
      },
    });

    y = (doc as any).lastAutoTable.finalY + margin;
    return y;
  };

  // Function to create financial summary section
  const financialSummarySection = (doc: jsPDF, workLog: WorkLog, y: number, options: any) => {
    const { margin } = options;
    addSectionTitle('Financial Summary');
    // Use timeTracking.totalHours for consistency
    addKeyValuePair('Total Hours', String(workLog.timeTracking?.totalHours || 0));
    addKeyValuePair('Hourly Rate', formatCurrency(workLog.hourlyRate || 0));
    addKeyValuePair('Signed Quote Amount', formatCurrency(workLog.signedQuoteAmount || 0));
    addKeyValuePair('Is Quote Signed', String(workLog.isQuoteSigned || false));
    return y;
  };

  // Add header
  addHeader('Work Log Details');

  // Define options
  const options = { margin };

  // Add info boxes section
  y = infoBoxesSection(doc, workLog, y, options);

  // Add details section
  y = detailsSection(doc, workLog, y, options, 'Tasks', workLog.tasks || 'N/A');
  y = detailsSection(doc, workLog, y, options, 'Notes', workLog.notes || 'N/A');
  y = detailsSection(doc, workLog, y, options, 'Waste Management', workLog.wasteManagement || 'N/A');

  // Add consumables table
  if (workLog.consumables && workLog.consumables.length > 0) {
    y = consumablesTable(doc, workLog, y, options);
  }

  // Add financial summary section
  y = financialSummarySection(doc, workLog, y, options);

  // Save the PDF with a consistent file name
  const fileName = `worklog-${workLog.id}.pdf`;
  doc.save(fileName);
  
  // Return the file name for reference
  return fileName;
};
