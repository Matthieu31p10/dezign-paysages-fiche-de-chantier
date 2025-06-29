
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

export interface ProjectTeam {
  id: string;
  projectId: string;
  teamId: string;
  isPrimary: boolean;
  createdAt: Date;
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
  teams: ProjectTeam[]; // Changé de string à ProjectTeam[]
  team: string; // Maintenu pour compatibilité - sera l'équipe primaire
  projectType: 'residence' | 'particular' | 'enterprise' | 'ponctuel' | '';
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
  projectId: string;
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
  
  // Champs pour les fiches vierges
  clientName?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  hourlyRate?: number;
  linkedProjectId?: string;
  signedQuoteAmount?: number;
  isQuoteSigned?: boolean;
  isBlankWorksheet?: boolean;
  createdAt?: Date;
  createdBy?: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
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

export interface ClientVisibilityPermissions {
  // Informations générales du projet
  showProjectName?: boolean;
  showClientName?: boolean;
  showAddress?: boolean;
  showContactInfo?: boolean;
  showProjectType?: boolean;
  showTeam?: boolean;
  
  // Informations contractuelles
  showContractDetails?: boolean;
  showStartEndDates?: boolean;
  showAnnualVisits?: boolean;
  showVisitDuration?: boolean;
  showAdditionalInfo?: boolean;
  
  // Informations techniques
  showIrrigation?: boolean;
  showMowerType?: boolean;
  
  // Fiches de suivi
  showWorkLogs?: boolean;
  showPersonnel?: boolean;
  showTimeTracking?: boolean;
  showTasks?: boolean;
  showWaterConsumption?: boolean;
  showNotes?: boolean;
  showConsumables?: boolean;
  showInvoicedStatus?: boolean;
  
  // Documents
  showDocuments?: boolean;
}

export interface ClientConnection {
  id: string;
  clientName: string;
  email: string;
  password: string;
  assignedProjects: string[]; // Array of project IDs
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  visibilityPermissions?: ClientVisibilityPermissions;
}

export interface AppSettings {
  companyName?: string;
  companyLogo?: string;
  loginBackgroundImage?: string;
  companyInfo?: CompanyInfo;
  users?: User[];
  personnel?: Personnel[];
  customTasks?: CustomTask[];
  clientConnections?: ClientConnection[];
}
