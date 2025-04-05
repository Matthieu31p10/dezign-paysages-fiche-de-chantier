
import { z } from 'zod';

export const workTaskSchema = z.object({
  projectName: z.string().min(1, "Nom du chantier requis"),
  address: z.string().min(1, "Adresse requise"),
  contactName: z.string().min(1, "Nom du contact requis"),
  clientPresent: z.boolean().default(false),
  date: z.string().min(1, "Date requise"),
  personnel: z.array(z.string()).min(1, "Au moins une personne requise"),
  timeTracking: z.object({
    departure: z.string().min(1, "Heure de départ requise"),
    arrival: z.string().min(1, "Heure d'arrivée requise"),
    end: z.string().min(1, "Heure de fin requise"),
    breakTime: z.string().default("00:00"),
    travelHours: z.number().min(0),
    workHours: z.number().min(0),
    totalHours: z.number().min(0),
  }),
  tasksPerformed: z.object({
    customTasks: z.record(z.boolean()),
    tasksProgress: z.record(z.number()),
  }),
  wasteManagement: z.object({
    wasteTaken: z.boolean().default(false),
    wasteLeft: z.boolean().default(false),
    wasteDetails: z.string().optional(),
  }),
  notes: z.string().optional(),
  supplies: z.array(z.object({
    supplier: z.string(),
    material: z.string(),
    unit: z.string(),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
  })),
  hourlyRate: z.number().min(0),
});

export type WorkTaskFormValues = z.infer<typeof workTaskSchema>;
