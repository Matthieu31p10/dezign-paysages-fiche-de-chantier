
import * as z from 'zod';

export const formSchema = z.object({
  projectId: z.string().min(1, { message: "Veuillez sélectionner un chantier." }),
  date: z.date({
    required_error: "Une date est requise.",
  }),
  duration: z.number({
    required_error: "La durée est requise.",
    invalid_type_error: "La durée doit être un nombre."
  }).min(0, { message: "La durée doit être positive." }),
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
  teamFilter: z.string().optional().default(""),
  // Modifié pour accepter des booléens ou être indéfini/null
  customTasks: z.record(z.string(), z.boolean().optional()).optional().default({}),
  tasksProgress: z.record(z.string(), z.number().optional()).optional().default({}),
  watering: z.enum(['none', 'on', 'off']).default('none'),
});

export type FormValues = z.infer<typeof formSchema>;
