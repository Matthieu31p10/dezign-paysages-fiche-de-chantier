
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  drivingLicense?: string;
  createdAt: Date;
  permissions?: Record<string, boolean>;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface ProjectInfo {
  id: string;
  name: string;
  clientName?: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  contact: {
    name?: string;
    phone: string;
    email: string;
  };
  contract: {
    details: string;
    documentUrl?: string;
  };
  irrigation?: 'irrigation' | 'none' | 'disabled';
  mowerType?: 'large' | 'small' | 'both';
  annualVisits: number;
  annualTotalHours: number;
  visitDuration: number;
  additionalInfo: string;
  team: string;
  projectType: 'residence' | 'particular' | 'enterprise' | '';
  startDate?: Date | null;
  endDate?: Date | null;
  isArchived?: boolean;
  createdAt: Date;
  documents?: ProjectDocument[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
}

export interface CustomTask {
  id: string;
  name: string;
}

export interface Consumable {
  id: string;
  supplier: string;
  product: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WorkLog {
  id: string;
  projectId: string; // Now always required for work logs
  date: string;
  personnel: string[];
  timeTracking?: {
    departure?: string;
    arrival?: string;
    end?: string;
    breakTime?: string;
    totalHours?: number;
  };
  duration?: number;
  waterConsumption?: number;
  wasteManagement?: string;
  tasks?: string;
  notes?: string;
  consumables?: Consumable[];
  invoiced?: boolean;
  isArchived?: boolean;
  clientSignature?: string;
  tasksPerformed?: {
    watering?: 'none' | 'on' | 'off';
    customTasks?: Record<string, boolean>;
    tasksProgress?: Record<string, number>;
  };
  
  // Optional fields that may be used in some contexts
  clientName?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  hourlyRate?: number;
  linkedProjectId?: string;
  signedQuoteAmount?: number;
  isQuoteSigned?: boolean;
  createdAt?: Date;
  createdBy?: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  managerName: string;
  phone: string;
  email: string;
}

export interface Personnel {
  id: string;
  name: string;
  position?: string;
  active: boolean;
}

export interface AppSettings {
  companyName?: string;
  companyLogo?: string;
  loginBackgroundImage?: string;
  companyInfo?: CompanyInfo;
  users?: User[];
  personnel?: Personnel[];
  customTasks?: CustomTask[];
}
