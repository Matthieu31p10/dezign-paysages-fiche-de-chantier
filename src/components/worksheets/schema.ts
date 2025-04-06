
import { z } from "zod";

export const blankWorkSheetSchema = z.object({
  clientName: z.string().min(1, "Le nom du client est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Email invalide").optional().or(z.literal('')),
  date: z.date(),
  workDescription: z.string().min(1, "La description des travaux est requise"),
  personnel: z.array(z.string()).min(1, "Au moins une personne est requise"),
  departure: z.string(),
  arrival: z.string(),
  end: z.string(),
  breakTime: z.string(),
  totalHours: z.number().positive(),
  watering: z.enum(["none", "on", "off"]),
  wasteManagement: z.enum(["none", "recycling", "composting", "waste"]),
  waterConsumption: z.number().optional(),
  notes: z.string().optional(),
  customTasks: z.array(z.string()).optional(),
  tasksProgress: z.record(z.string(), z.number()).optional(),
  teamFilter: z.string(),
  linkedProjectId: z.string().optional(),
});

export type BlankWorkSheetValues = z.infer<typeof blankWorkSheetSchema>;
