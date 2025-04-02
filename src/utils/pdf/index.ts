
import { WorkLog, ProjectInfo, CompanyInfo } from '@/types/models';
import { generateWorkLogPDF } from './workLogPDF';
import { generateProjectPDF } from './projectPDF';
import { generateReportPDF } from './reportPDF';

/**
 * Main PDF generation interface
 */
interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
}

/**
 * Generate a PDF based on the provided data
 */
export const generatePDF = async (data: PDFData): Promise<string> => {
  return generateWorkLogPDF(data);
};

// Export the specific PDF generator functions
export {
  generateWorkLogPDF,
  generateProjectPDF,
  generateReportPDF
};
