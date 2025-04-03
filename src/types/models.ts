
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

export interface CustomTask {
  id: string;
  name: string;
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
    end: string;
    breakTime: string; // Keeping this as string to match the form
    totalHours: number;
  };
  tasksPerformed: {
    watering: 'none' | 'on' | 'off';
    customTasks?: { [id: string]: boolean }; // Add custom tasks
    customTasksProgress?: { [id: string]: number }; // Add custom tasks progress
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

export interface Personnel {
  id: string;
  name: string;
  position?: string;
  active: boolean;
}

export interface AppSettings {
  companyLogo?: string;
  loginBackgroundImage?: string;
  companyInfo?: CompanyInfo;
  users?: User[];
  personnel?: Personnel[];
  customTasks?: CustomTask[]; // Add custom tasks to settings
}
