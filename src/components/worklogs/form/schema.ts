
import * as z from 'zod';

export const formSchema = z.object({
  projectId: z.string().min(1, { message: "Veuillez sélectionner un chantier." }),
  date: z.date({
    required_error: "Une date est recommandée.",
  }).optional().default(() => new Date()),
  duration: z.number({
    invalid_type_error: "La durée doit être un nombre."
  }).min(0, { message: "La durée doit être positive." }).optional().default(0),
  personnel: z.array(z.string()).optional().default([]),
  departure: z.string().optional().default(""),
  arrival: z.string().optional().default(""),
  end: z.string().optional().default(""),
  breakTime: z.string().optional().default("00:00"),
  totalHours: z.number({
    invalid_type_error: "Le total d'heures doit être un nombre."
  }).min(0, { message: "Le total d'heures doit être positive." }).optional().default(0),
  notes: z.string().optional(),
  waterConsumption: z.number().optional(),
  teamFilter: z.string().optional().default(""),
  // Modifié pour accepter des booléens ou être indéfini/null
  customTasks: z.record(z.string(), z.boolean().optional()).optional().default({}),
  tasksProgress: z.record(z.string(), z.number().optional()).optional().default({}),
  watering: z.enum(['none', 'on', 'off']).default('none'),
  wasteManagement: z.string().default('none'),
});

export type FormValues = z.infer<typeof formSchema>;
