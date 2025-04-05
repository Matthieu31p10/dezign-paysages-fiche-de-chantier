
import { CustomTask } from "./models";

export interface WorkTaskSupplier {
  supplier: string;
  material: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface WorkTask {
  id: string;
  createdAt: Date;
  date: Date;
  projectName: string;
  address: string;
  contactName: string;
  clientPresent: boolean;
  personnel: string[];
  timeTracking: {
    departure: string;
    arrival: string;
    end: string;
    breakTime: string;
    travelHours: number;
    workHours: number;
    totalHours: number;
  };
  tasksPerformed: {
    customTasks: {
      [id: string]: boolean;
    };
    tasksProgress: {
      [id: string]: number;
    };
  };
  wasteManagement: {
    wasteTaken: boolean;
    wasteLeft: boolean;
    wasteDetails: string;
  };
  notes: string;
  supplies: WorkTaskSupplier[];
  hourlyRate: number;
  signatures: {
    client: string | null;
    teamLead: string | null;
  };
}
