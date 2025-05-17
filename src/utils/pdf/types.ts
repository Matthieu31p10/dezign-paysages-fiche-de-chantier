
import { ProjectInfo, WorkLog, CompanyInfo, CustomTask } from '@/types/models';

export interface PDFOptions {
  includeContactInfo?: boolean;
  includeCompanyInfo?: boolean;
  includePersonnel?: boolean;
  includeTasks?: boolean;
  includeWasteManagement?: boolean;
  includeWatering?: boolean;
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
  action?: 'download' | 'print';  // Action property
  config?: any;  // Config property for additional configuration
}
