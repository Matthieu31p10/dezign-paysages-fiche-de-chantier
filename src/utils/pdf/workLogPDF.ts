
import { generateModernWorkLogPDF } from './modernPDF';
import { PDFData } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
// This now delegates to the modern implementation
export const generateWorkLogPDF = (data: PDFData): string => {
  return generateModernWorkLogPDF(data);
};
