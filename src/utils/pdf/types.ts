
import { ProjectInfo, WorkLog, CompanyInfo, CustomTask } from '@/types/models';

export interface PDFOptions {
  includeContactInfo?: boolean;
  includeCompanyInfo?: boolean;
  includePersonnel?: boolean;
  includeTasks?: boolean;
  includeWatering?: boolean;
  includeNotes?: boolean;
  includeTimeTracking?: boolean;
}

export interface PDFData {
  workLog?: WorkLog;
  project?: ProjectInfo;
  endTime?: string;
  companyInfo?: CompanyInfo;
  companyLogo?: string;
  pdfOptions?: PDFOptions;
  customTasks?: CustomTask[]; // Added this field
}
