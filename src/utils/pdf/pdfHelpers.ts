
import { PDFData, PDFTheme } from './types';
import { getTheme } from './themes/pdfThemes';

// Default color definitions for backward compatibility
export const pdfColors = {
  primary: [61, 90, 254],   // Blue
  secondary: [70, 128, 131],// Teal
  accent: [61, 174, 43],    // Green
  text: [60, 60, 60],       // Dark gray
  lightText: [120, 120, 120],// Light gray
  background: [255, 255, 255],// White
  lightGrey: [248, 248, 248], // Light grey for backgrounds
  border: [220, 220, 220]   // Border color
};

// Get the theme for a PDF data object
export const getPDFTheme = (data: PDFData): PDFTheme => {
  if (!data.theme) {
    return getTheme();
  }
  
  if (typeof data.theme === 'string') {
    return getTheme(data.theme);
  }
  
  return data.theme; // If it's already a theme object
};

// Sanitize text to prevent PDF generation errors from invalid characters
export const sanitizeText = (text?: string): string => {
  if (!text) return '';
  // Replace problem characters or sequences that can cause issues in PDFs
  return text
    .replace(/[\u0000-\u001F]/g, ' ')  // Control characters
    .replace(/[\u2028\u2029]/g, ' ')   // Line/paragraph separators
    .trim();
};

// Draw an info box with a title and custom content
export const drawInfoBox = (
  pdf: any, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  title: string, 
  contentDrawer: () => void,
  theme?: PDFTheme
): void => {
  const colors = theme?.colors || pdfColors;
  
  // Box background
  pdf.setFillColor(colors.lightGrey[0], colors.lightGrey[1], colors.lightGrey[2]);
  pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  pdf.roundedRect(x, y, width, height, 2, 2, 'FD');
  
  // Title
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.setFontSize(theme?.fonts.subtitle.size || 10);
  pdf.setFont(theme?.fonts.subtitle.family || 'helvetica', theme?.fonts.subtitle.style || 'bold');
  pdf.text(title, x + 5, y + 5);
  
  // Reset text color for content
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Draw content using the provided drawer function
  contentDrawer();
};

// Draw a time box with label and value
export const drawTimeBox = (
  pdf: any, 
  x: number, 
  y: number, 
  width: number, 
  label: string, 
  value: string,
  theme?: PDFTheme
): void => {
  const colors = theme?.colors || pdfColors;
  const fonts = theme?.fonts || {
    subtitle: { size: 9, family: 'helvetica', style: 'bold' },
    body: { size: 10, family: 'helvetica', style: 'normal' }
  };
  
  // Box background
  pdf.setFillColor(colors.lightGrey[0], colors.lightGrey[1], colors.lightGrey[2]);
  pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  pdf.roundedRect(x, y, width, 20, 2, 2, 'FD');
  
  // Label
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.setFontSize(fonts.subtitle.size);
  pdf.setFont(fonts.subtitle.family, fonts.subtitle.style);
  pdf.text(label, x + width / 2, y + 6, { align: 'center' });
  
  // Value
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFontSize(fonts.body.size);
  pdf.setFont(fonts.body.family, 'bold');
  pdf.text(value, x + width / 2, y + 15, { align: 'center' });
  
  // Reset text color
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
};

// Apply theme settings to the PDF document
export const applyTheme = (pdf: any, theme: PDFTheme): void => {
  pdf.setTextColor(theme.colors.text[0], theme.colors.text[1], theme.colors.text[2]);
  pdf.setFont(theme.fonts.body.family, theme.fonts.body.style);
  pdf.setFontSize(theme.fonts.body.size);
};

// Draw a styled section title
export const drawSectionTitle = (
  pdf: any,
  title: string,
  x: number, 
  y: number,
  theme?: PDFTheme
): number => {
  const colors = theme?.colors || pdfColors;
  const fonts = theme?.fonts || {
    subtitle: { size: 12, family: 'helvetica', style: 'bold' }
  };
  
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setFontSize(fonts.subtitle.size);
  pdf.setFont(fonts.subtitle.family, fonts.subtitle.style);
  
  pdf.text(title, x, y);
  
  // Reset text color
  pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  return y + (theme?.spacing.paragraphGap || 6);
};

// Draw a styled section with a title and content
export const drawSection = (
  pdf: any,
  title: string,
  x: number,
  y: number,
  width: number,
  drawContent: (startY: number) => number,
  theme?: PDFTheme
): number => {
  const newY = drawSectionTitle(pdf, title, x, y, theme);
  
  // Draw a light background for the section
  const colors = theme?.colors || pdfColors;
  
  // Let the content drawer function handle the actual content
  const endY = drawContent(newY);
  
  return endY + (theme?.spacing.sectionGap || 10);
};
