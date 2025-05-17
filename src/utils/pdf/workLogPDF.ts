
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
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
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
  const pdfOptions = data.pdfOptions || {};

  // Define margins and starting Y position
  const margin = 10;
  let y = margin;

  // Add company header if requested
  if (pdfOptions.includeCompanyInfo && data.companyInfo) {
    // Add company logo if available
    if (data.companyLogo) {
      try {
        // Add logo with maximum width of 40mm and maximum height of 20mm
        doc.addImage(data.companyLogo, 'PNG', margin, y, 40, 20);
        y += 25; // Add space after logo
      } catch (error) {
        console.warn('Failed to add company logo to PDF', error);
      }
    }

    // Add company name and info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(data.companyInfo.name || '', margin, y);
    y += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (data.companyInfo.address) {
      doc.text(data.companyInfo.address, margin, y);
      y += 5;
    }
    
    if (data.companyInfo.phone) {
      doc.text(`Tél: ${data.companyInfo.phone}`, margin, y);
      y += 5;
    }
    
    if (data.companyInfo.email) {
      doc.text(`Email: ${data.companyInfo.email}`, margin, y);
      y += 5;
    }
    
    y += 5; // Add some extra space after company info
  }

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
    doc.text(String(value), margin + 35, y);
    y += 5;
  };

  // Add document title
  addHeader(workLog.isBlankWorksheet ? 'Fiche d\'intervention vierge' : 'Fiche de suivi');
  y += 5;

  // Add project and client info if requested
  if (pdfOptions.includeContactInfo && data.project) {
    addSectionTitle('Informations Client');
    
    addKeyValuePair('Client', data.project.clientName || workLog.clientName || 'N/A');
    addKeyValuePair('Chantier', data.project.name || 'N/A');
    addKeyValuePair('Adresse', data.project.address || workLog.address || 'N/A');
    
    if (data.project.contact) {
      addKeyValuePair('Contact', data.project.contact.name || 'N/A');
      addKeyValuePair('Téléphone', data.project.contact.phone || 'N/A');
      addKeyValuePair('Email', data.project.contact.email || 'N/A');
    }
    
    y += 5;
  } else if (workLog.clientName) {
    addSectionTitle('Informations Client');
    addKeyValuePair('Client', workLog.clientName);
    if (workLog.address) addKeyValuePair('Adresse', workLog.address);
    y += 5;
  }

  // Add date and reference
  addSectionTitle('Détails de l\'intervention');
  addKeyValuePair('Date', formatDate(workLog.date));
  addKeyValuePair('Référence', workLog.projectId || 'N/A');
  y += 5;

  // Add personnel if requested
  if (pdfOptions.includePersonnel && workLog.personnel && workLog.personnel.length > 0) {
    addSectionTitle('Personnel présent');
    workLog.personnel.forEach(person => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`• ${person}`, margin, y);
      y += 5;
    });
    y += 5;
  }

  // Add time tracking if requested
  if (pdfOptions.includeTimeTracking && workLog.timeTracking) {
    addSectionTitle('Suivi du temps');
    addKeyValuePair('Heure d\'arrivée', workLog.timeTracking.arrival || 'N/A');
    addKeyValuePair('Heure de départ', workLog.timeTracking.end || 'N/A');
    addKeyValuePair('Temps total', `${workLog.timeTracking.totalHours || 0} heures`);
    y += 5;
  }

  // Add tasks if requested
  if (pdfOptions.includeTasks && workLog.tasks) {
    addSectionTitle('Travaux effectués');
    
    // Define max width for text wrapping
    const maxWidth = doc.internal.pageSize.getWidth() - (2 * margin);
    
    // Split text into lines for proper wrapping
    const taskLines = doc.splitTextToSize(workLog.tasks, maxWidth);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(taskLines, margin, y);
    
    // Update y position based on the number of lines
    y += (taskLines.length * 5) + 5;
  }

  // Add waste management if requested
  if (pdfOptions.includeWasteManagement && workLog.wasteManagement && workLog.wasteManagement !== 'none') {
    addSectionTitle('Gestion des déchets');
    
    // Parse the waste management value
    const wasteType = workLog.wasteManagement.split('_')[0] || '';
    const wasteQty = workLog.wasteManagement.split('_')[1] || '1';
    
    let wasteTypeName = '';
    switch (wasteType) {
      case 'big_bag':
        wasteTypeName = 'Big-bag';
        break;
      case 'benne':
        wasteTypeName = 'Benne';
        break;
      case 'container':
        wasteTypeName = 'Container';
        break;
      default:
        wasteTypeName = wasteType;
    }
    
    addKeyValuePair('Type', wasteTypeName);
    addKeyValuePair('Quantité', `${wasteQty} unité(s)`);
    
    y += 5;
  }

  // Add watering if requested
  if (pdfOptions.includeWatering && workLog.waterConsumption) {
    addSectionTitle('Arrosage');
    addKeyValuePair('Consommation d\'eau', `${workLog.waterConsumption} litres`);
    y += 5;
  }

  // Add notes if requested
  if (pdfOptions.includeNotes && workLog.notes) {
    addSectionTitle('Notes et observations');
    
    // Define max width for text wrapping
    const maxWidth = doc.internal.pageSize.getWidth() - (2 * margin);
    
    // Split text into lines for proper wrapping
    const noteLines = doc.splitTextToSize(workLog.notes, maxWidth);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(noteLines, margin, y);
    
    // Update y position based on the number of lines
    y += (noteLines.length * 5) + 5;
  }

  // Add financial summary if requested (mainly for blank worksheets)
  if (pdfOptions.includeSummary) {
    addSectionTitle('Bilan financier');
    
    const totalHours = workLog.timeTracking?.totalHours || 0;
    const personnelCount = workLog.personnel?.length || 1;
    const totalTeamHours = totalHours * personnelCount;
    const hourlyRate = workLog.hourlyRate || 0;
    
    addKeyValuePair('Heures équipe', `${totalTeamHours.toFixed(2)} h`);
    
    if (hourlyRate > 0) {
      addKeyValuePair('Taux horaire', formatCurrency(hourlyRate));
      addKeyValuePair('Total main d\'œuvre', formatCurrency(totalTeamHours * hourlyRate));
    }
    
    if (workLog.signedQuoteAmount > 0) {
      addKeyValuePair('Montant du devis', formatCurrency(workLog.signedQuoteAmount));
      addKeyValuePair('Devis signé', workLog.isQuoteSigned ? 'Oui' : 'Non');
    }
    
    // Add consumables summary if present
    if (workLog.consumables && workLog.consumables.length > 0) {
      y += 5;
      addSectionTitle('Matériaux utilisés');
      
      // Create table header
      const tableColumns = ['Produit', 'Quantité', 'Prix unitaire', 'Total'];
      const tableRows = workLog.consumables.map(item => [
        item.product || 'N/A',
        String(item.quantity || 0),
        formatCurrency(item.unitPrice || 0),
        formatCurrency(item.totalPrice || 0)
      ]);
      
      // Calculate total price of materials
      const totalMaterials = workLog.consumables.reduce(
        (sum, item) => sum + (item.totalPrice || 0), 0
      );
      
      // Add table
      (doc as any).autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: y,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        columnStyles: { 
          0: { cellWidth: 'auto' },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 35, halign: 'right' }
        }
      });
      
      y = (doc as any).lastAutoTable.finalY + 5;
      
      // Add total
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Total fournitures:', doc.internal.pageSize.getWidth() - margin - 70, y);
      doc.text(formatCurrency(totalMaterials), doc.internal.pageSize.getWidth() - margin - 35, y);
      
      y += 10;
      
      // Add grand total if hourly rate exists
      if (hourlyRate > 0) {
        const laborCost = totalTeamHours * hourlyRate;
        const grandTotal = laborCost + totalMaterials;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Total général:', doc.internal.pageSize.getWidth() - margin - 70, y);
        doc.text(formatCurrency(grandTotal), doc.internal.pageSize.getWidth() - margin - 35, y);
      }
    }
    
    y += 10;
  }

  // Add signature section if client signature exists
  if (workLog.clientSignature) {
    y += 10;
    addSectionTitle('Signature client');
    
    try {
      doc.addImage(workLog.clientSignature, 'PNG', margin, y, 60, 30);
      y += 35;
    } catch (error) {
      console.warn('Failed to add client signature to PDF', error);
      y += 5;
    }
  }

  // Add footer with page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 10);
    
    // Add generation date
    const today = format(new Date(), 'dd/MM/yyyy', { locale: fr });
    doc.text(`Document généré le ${today}`, margin, doc.internal.pageSize.getHeight() - 10);
  }

  // Save the PDF with a consistent file name
  const fileName = `worklog-${workLog.id}.pdf`;
  doc.save(fileName);
  
  // Return the file name for reference
  return fileName;
};
