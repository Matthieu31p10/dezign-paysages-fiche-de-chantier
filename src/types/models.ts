
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
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface ProjectInfo {
  id: string;
  name: string;
  address: string;
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
}

export interface WorkLog {
  id: string;
  projectId: string;
  date: Date;
  duration: number;
  personnel: string[];
  timeTracking: {
    departure: string;
    arrival: string;
    end: string; // Ensuring this property exists
    breakTime: string; // Using string type to match usage
    totalHours: number;
  };
  tasksPerformed: {
    mowing: boolean;
    brushcutting: boolean;
    blower: boolean;
    manualWeeding: boolean;
    whiteVinegar: boolean;
    pruning: {
      done: boolean;
      progress: number;
    };
    watering: 'none' | 'on' | 'off';
  };
  notes?: string; // Field for adding notes
  waterConsumption?: number; // Field for water consumption in m3
  createdAt: Date;
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

export interface AppSettings {
  companyLogo?: string;
  loginBackgroundImage?: string;
  companyInfo?: CompanyInfo;
  users?: User[];
}
