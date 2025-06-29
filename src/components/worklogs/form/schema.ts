
import { z } from 'zod';

// Schéma de base pour les consommables
const consumableSchema = z.object({
  id: z.string().optional(),
  supplier: z.string(),
  product: z.string(),
  unit: z.string(),
  quantity: z.coerce.number(),
  unitPrice: z.coerce.number(),
  totalPrice: z.coerce.number()
});

// Schéma complet pour le formulaire WorkLog
export const formSchema = z.object({
  // Champs communs
  projectId: z.string().optional(),
  date: z.date(),
  personnel: z.array(z.string()).min(1, "Sélectionnez au moins une personne"),
  duration: z.coerce.number().min(0, "La durée doit être positive").optional().default(0),
  notes: z.string().optional(),
  
  // Suivi du temps
  departure: z.string().optional(),
  arrival: z.string().optional(),
  end: z.string().optional(),
  breakTime: z.string().optional(),
  totalHours: z.coerce.number().optional().default(0),
  
  // Tâches et consommations
  waterConsumption: z.coerce.number().optional().default(0),
  teamFilter: z.string().optional().default("all"),
  watering: z.enum(['none', 'on', 'off']).optional().default('none'),
  customTasks: z.record(z.boolean()).optional().default({}),
  tasksProgress: z.record(z.number()).optional().default({}),
  wasteManagement: z.string().optional().default('none'),
  invoiced: z.boolean().optional().default(false),
  consumables: z.array(consumableSchema).optional().default([]),
  
  // Champs pour les fiches vierges (blank worksheets)
  clientName: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  hourlyRate: z.coerce.number().optional(),
  signedQuoteAmount: z.coerce.number().optional(),
  isQuoteSigned: z.boolean().optional(),
  linkedProjectId: z.string().optional(),
  vatRate: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
