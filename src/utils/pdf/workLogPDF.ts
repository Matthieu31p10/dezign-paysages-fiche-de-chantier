
import { generateModernWorkLogPDF } from './modernPDF';
import { PDFData } from './types';
import { formatDate, formatCurrency } from './formatHelpers';

// Updated function signature to receive PDFData and return a file name
// This now delegates to the modern implementation
export const generateWorkLogPDF = (data: PDFData): string => {
  return generateModernWorkLogPDF(data);
};
