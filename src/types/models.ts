
export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
  name?: string;
  email?: string;
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
    name?: string; // Nouveau champ ajouté
    phone: string;
    email: string;
  };
  contract: {
    details: string;
    documentUrl?: string;
  };
  irrigation?: 'irrigation' | 'none' | 'disabled'; // Nouveau champ ajouté
  mowerType?: 'large' | 'small' | 'both'; // Nouveau champ ajouté
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
    end: string;
    breakTime: string;
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
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
}

export interface AppSettings {
  companyLogo?: string;
  users?: User[];
}
