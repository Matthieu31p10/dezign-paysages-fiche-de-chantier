
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  name?: string;
  email?: string;
  phone?: string; // Nouveau champ ajouté
  position?: string; // Nouveau champ ajouté (poste)
  drivingLicense?: string; // Nouveau champ ajouté (permis)
  createdAt: Date;
  permissions?: Record<string, boolean>; // Permissions personnalisées
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface ProjectInfo {
  id: string;
  name: string;
  clientName?: string;  // Added this property
  address: string;
  contactPhone?: string; // Added this property
  contactEmail?: string; // Added this property
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
  documents?: ProjectDocument[]; // Documents associés au chantier
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string; // URL encodée en base64 ou chemin vers le fichier
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
  date: string;  // Make sure this is string, not Date
  personnel: string[];
  timeTracking: {
    departure?: string;
    arrival?: string;
    end?: string;
    breakTime?: string;
    totalHours: number;
  };
  duration?: number;
  waterConsumption?: number;
  wasteManagement?: string;
  tasks?: string;
  notes?: string;
  consumables?: Consumable[];
  createdAt?: Date;
  invoiced?: boolean;
  isArchived?: boolean;
  clientSignature?: string;
  tasksPerformed?: {
    watering?: 'none' | 'on' | 'off';
    customTasks?: Record<string, boolean>;
    tasksProgress?: Record<string, number>;
    pruning?: { 
      done: boolean;
      progress: number;
    };
    mowing?: boolean;
    brushcutting?: boolean;
    blower?: boolean;
    manualWeeding?: boolean;
    whiteVinegar?: boolean;
  };
  clientName?: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  hourlyRate?: number;
  linkedProjectId?: string;
  signedQuoteAmount?: number;
  isQuoteSigned?: boolean;
  isBlankWorksheet?: boolean;  // Added the missing property
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
  companyName?: string; // Added the companyName property
  companyLogo?: string;
  loginBackgroundImage?: string;
  companyInfo?: CompanyInfo;
  users?: User[];
  personnel?: Personnel[];
  customTasks?: CustomTask[];
}
