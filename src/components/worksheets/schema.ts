
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
  wasteManagement: z.enum([
    "none", 
    "big_bag_1", "big_bag_2", "big_bag_3", "big_bag_4", "big_bag_5",
    "half_dumpster_1", "half_dumpster_2", "half_dumpster_3",
    "dumpster_1", "dumpster_2", "dumpster_3"
  ]),
  waterConsumption: z.number().optional(),
  notes: z.string().optional(),
  customTasks: z.record(z.string(), z.boolean()).optional(),
  tasksProgress: z.record(z.string(), z.number()).optional(),
  teamFilter: z.string(),
  linkedProjectId: z.string().optional(),
});

export type BlankWorkSheetValues = z.infer<typeof blankWorkSheetSchema>;
