export interface WorkLogTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'maintenance' | 'installation' | 'repair' | 'inspection' | 'custom';
  isDefault?: boolean;
  template: {
    personnel?: string[];
    tasks?: string;
    wasteManagement?: string;
    notes?: string;
    hourlyRate?: number;
    waterConsumption?: number;
    customTasks?: Record<string, boolean>;
    estimatedDuration?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlankWorksheetTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'client_visit' | 'quote' | 'maintenance' | 'custom';
  isDefault?: boolean;
  template: {
    clientName?: string;
    address?: string;
    contactPhone?: string;
    contactEmail?: string;
    personnel?: string[];
    tasks?: string;
    wasteManagement?: string;
    notes?: string;
    hourlyRate?: number;
    isQuoteSigned?: boolean;
    signedQuoteAmount?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type Template = WorkLogTemplate | BlankWorksheetTemplate;