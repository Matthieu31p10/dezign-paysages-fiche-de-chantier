
import jsPDF from 'jspdf';
import { formatCurrency } from '../formatHelpers';
import { PDFTheme } from '../types';

interface SummaryData {
  hourlyRate?: number;
  totalHours?: number;
  materialCost?: number;
  taxRate?: number;
  discount?: number;
  signedQuote?: boolean;
  quoteValue?: number;
}

export const addSummarySection = (
  doc: jsPDF,
  data: SummaryData,
  startY: number,
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
  
  // Set up colors
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  let y = startY;
  
  // Add summary title
  doc.setFont(fonts.title.family, fonts.title.style);
  doc.setFontSize(fonts.title.size);
  doc.text('Bilan financier', spacing.margin, y);
  y += spacing.paragraphGap;
  
  doc.setFont(fonts.body.family, fonts.body.style);
  doc.setFontSize(fonts.body.size);

  // Setup for summary items
  const margin = spacing.margin;
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = margin;
  const rightColumnX = pageWidth / 2 + 10;
  const lineHeight = 6;
  
  // Calculate totals
  const hourlyRate = data.hourlyRate || 0;
  const totalHours = data.totalHours || 0;
  const laborCost = hourlyRate * totalHours;
  const materialCost = data.materialCost || 0;
  const subtotal = laborCost + materialCost;
  const taxRate = data.taxRate || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const discount = data.discount || 0;
  const total = subtotal + taxAmount - discount;
  
  // If there's a signed quote
  if (data.signedQuote && data.quoteValue) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Devis signé:', leftColumnX, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text('Oui', leftColumnX + 70, y);
    y += lineHeight;
    
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Montant du devis:', leftColumnX, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(formatCurrency(data.quoteValue), leftColumnX + 70, y);
    y += lineHeight * 2;
  }
  
  // Labor cost
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Tarif horaire:', leftColumnX, y);
  doc.text('Heures travaillées:', rightColumnX, y);
  y += lineHeight;
  
  doc.setFont(fonts.body.family, 'normal');
  doc.text(formatCurrency(hourlyRate) + '/h', leftColumnX, y);
  doc.text(`${totalHours} h`, rightColumnX, y);
  y += lineHeight;
  
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Coût main d\'œuvre:', leftColumnX, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(formatCurrency(laborCost), leftColumnX + 70, y);
  y += lineHeight;
  
  // Material cost if applicable
  if (materialCost > 0) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Coût matériaux:', leftColumnX, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(formatCurrency(materialCost), leftColumnX + 70, y);
    y += lineHeight;
  }
  
  // Subtotal
  doc.setFont(fonts.body.family, 'bold');
  doc.text('Sous-total:', leftColumnX, y);
  doc.setFont(fonts.body.family, 'normal');
  doc.text(formatCurrency(subtotal), leftColumnX + 70, y);
  y += lineHeight;
  
  // Tax if applicable
  if (taxRate > 0) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text(`TVA (${taxRate}%):`, leftColumnX, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(formatCurrency(taxAmount), leftColumnX + 70, y);
    y += lineHeight;
  }
  
  // Discount if applicable
  if (discount > 0) {
    doc.setFont(fonts.body.family, 'bold');
    doc.text('Remise:', leftColumnX, y);
    doc.setFont(fonts.body.family, 'normal');
    doc.text(formatCurrency(discount), leftColumnX + 70, y);
    y += lineHeight;
  }
  
  // Total
  y += 2;
  doc.setLineWidth(0.5);
  doc.line(leftColumnX, y, leftColumnX + 100, y);
  y += 4;
  
  doc.setFont(fonts.title.family, fonts.title.style);
  doc.setFontSize(fonts.title.size);
  doc.text('Total:', leftColumnX, y);
  doc.text(formatCurrency(total), leftColumnX + 70, y);
  
  return y + spacing.sectionGap;
};
