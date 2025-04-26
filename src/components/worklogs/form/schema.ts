
import { z } from 'zod';

export const formSchema = z.object({
  projectId: z.string().min(1, "Veuillez sélectionner un projet"),
  date: z.date(),
  personnel: z.array(z.string()).min(1, "Veuillez sélectionner au moins une personne"),
  duration: z.coerce.number().nonnegative().optional().default(0),
  notes: z.string().optional().default(''),
  departure: z.string().optional().default(''),
  arrival: z.string().optional().default(''),
  end: z.string().optional().default(''),
  breakTime: z.string().optional().default(''),
  totalHours: z.coerce.number().nonnegative().optional().default(0),
  waterConsumption: z.coerce.number().nonnegative().optional().default(0),
  teamFilter: z.string().optional().default(''),
  watering: z.enum(['none', 'on', 'off']).optional().default('none'),
  customTasks: z.record(z.boolean()).optional().default({}),
  tasksProgress: z.record(z.number()).optional().default({}),
  wasteManagement: z.enum(['none', 'keep', 'remove']).optional().default('none'),
  invoiced: z.boolean().optional().default(false),
  consumables: z.array(
    z.object({
      id: z.string().optional(),
      supplier: z.string().min(1, "Fournisseur requis"),
      product: z.string().min(1, "Produit requis"),
      unit: z.string().min(1, "Unité requise"),
      quantity: z.coerce.number().nonnegative("La quantité doit être positive"),
      unitPrice: z.coerce.number().nonnegative("Le prix unitaire doit être positif"),
      totalPrice: z.coerce.number().nonnegative("Le prix total doit être positif")
    })
  ).optional().default([]),
});

export type FormValues = z.infer<typeof formSchema>;
