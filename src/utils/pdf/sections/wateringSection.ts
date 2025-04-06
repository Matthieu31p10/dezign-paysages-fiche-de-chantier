
import { PDFData } from '../types';
import { sanitizeText } from '../pdfHelpers';

export const drawWateringSection = (pdf: any, data: PDFData, margin: number, yPos: number, contentWidth: number): number => {
  // Since we no longer include watering info, this function will do nothing
  return yPos;
}
