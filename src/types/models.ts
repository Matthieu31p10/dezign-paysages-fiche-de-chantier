
export interface ProjectInfo {
  id: string;
  name: string;
  address: string;
  contact: {
    phone: string;
    email: string;
  };
  contract: {
    details: string;
    documentUrl?: string;
  };
  annualVisits: number;
  annualTotalHours: number;
  visitDuration: number;
  additionalInfo: string;
  team: string;
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
