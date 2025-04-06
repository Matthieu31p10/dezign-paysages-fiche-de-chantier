
import * as z from 'zod';

export const blankWorkSheetSchema = z.object({
  clientName: z.string().min(1, { message: "Le nom du client est requis." }),
  address: z.string().min(1, { message: "L'adresse est requise." }),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: "Format d'email invalide" }).optional(),
  date: z.date({
    required_error: "Une date est requise.",
  }),
  personnel: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins une personne." }),
  departure: z.string().min(1, { message: "L'heure de départ est requise." }),
  arrival: z.string().min(1, { message: "L'heure d'arrivée est requise." }),
  end: z.string().min(1, { message: "L'heure de fin est requise." }),
  breakTime: z.string().default("00:00"),
  totalHours: z.number({
    required_error: "Le total d'heures est requis.",
    invalid_type_error: "Le total d'heures doit être un nombre."
  }).min(0, { message: "Le total d'heures doit être positive." }),
  notes: z.string().optional(),
  waterConsumption: z.number().optional(),
  workDescription: z.string().min(1, { message: "La description des travaux est requise." }),
  teamFilter: z.string().optional().default(""),
  customTasks: z.record(z.string(), z.boolean().optional()).optional().default({}),
  tasksProgress: z.record(z.string(), z.number().optional()).optional().default({}),
  watering: z.enum(['none', 'on', 'off']).default('none'),
  wasteManagement: z.enum([
    'none',
    'big_bag_1', 'big_bag_2', 'big_bag_3', 'big_bag_4', 'big_bag_5',
    'half_dumpster_1', 'half_dumpster_2', 'half_dumpster_3',
    'dumpster_1', 'dumpster_2', 'dumpster_3'
  ]).default('none'),
});

export type BlankWorkSheetValues = z.infer<typeof blankWorkSheetSchema>;
