
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

export interface PDFThemeFont {
  family: string;
  style: string;
  size: number;
}

export interface PDFTheme {
  fonts: {
    title: PDFThemeFont;
    subtitle: PDFThemeFont;
    body: PDFThemeFont;
    small: PDFThemeFont;
  };
  colors: {
    primary: number[];
    secondary: number[];
    accent: number[];
    text: number[];
    lightText: number[];
    background: number[];
    lightGrey: number[];
    border: number[];
  };
  spacing: {
    margin: number;
    sectionGap: number;
    paragraphGap: number;
  };
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
  theme?: string | PDFTheme; // New theme property that can be a theme name or an actual theme object
}
