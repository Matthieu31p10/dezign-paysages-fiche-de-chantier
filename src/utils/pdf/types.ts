
import { ProjectInfo, WorkLog, CompanyInfo, CustomTask } from '@/types/models';

export interface PDFOptions {
  includeContactInfo?: boolean;
  includeCompanyInfo?: boolean;
  includePersonnel?: boolean;
  includeTasks?: boolean;
  includeWasteManagement?: boolean;
  includeNotes?: boolean;
  includeTimeTracking?: boolean;
  includeConsumables?: boolean;
  includeSummary?: boolean;
}

export interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
  pdfOptions?: PDFOptions;
  customTasks?: CustomTask[];
  linkedProjectId?: string; 
  hourlyRate?: number;
  consumables?: Array<{
    supplier?: string;
    product?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  vatRate?: number;
  signedQuote?: boolean;
  quoteValue?: number;
  action?: 'download' | 'print';  // Add the action property here
  config?: any;  // Add config property to handle additional configuration
}
