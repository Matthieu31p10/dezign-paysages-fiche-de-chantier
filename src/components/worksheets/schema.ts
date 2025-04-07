
import * as z from 'zod';
import { Consumable } from './consumables/types';

// Schema pour les valeurs de la fiche vierge
export const blankWorkSheetSchema = z.object({
  clientName: z.string().min(1, { message: "Nom du client requis" }),
  address: z.string().min(1, { message: "Adresse requise" }),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  date: z.date({
    required_error: "Date requise",
  }),
  personnel: z.array(z.string()).min(1, { message: "Au moins une personne requise" }),
  departure: z.string().min(1, { message: "Heure de départ requise" }),
  arrival: z.string().min(1, { message: "Heure d'arrivée requise" }),
  end: z.string().min(1, { message: "Heure de fin requise" }),
  breakTime: z.string().default("00:30"),
  totalHours: z.number(),
  hourlyRate: z.number().optional(),
  wasteManagement: z.enum([
    'none',
    'big_bag_1', 'big_bag_2', 'big_bag_3', 'big_bag_4', 'big_bag_5',
    'half_dumpster_1', 'half_dumpster_2', 'half_dumpster_3',
    'dumpster_1', 'dumpster_2', 'dumpster_3'
  ]).default('none'),
  teamFilter: z.string().optional(),
  linkedProjectId: z.string().optional(),
  workDescription: z.string().min(1, { message: "Description des travaux requise" }),
  consumables: z.array(
    z.object({
      supplier: z.string().optional(),
      product: z.string().optional(),
      unit: z.string().optional(),
      quantity: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number()
    })
  ).optional(),
  vatRate: z.enum(["10", "20"]).default("20"),
  signedQuote: z.boolean().default(false),
  quoteValue: z.number().optional(), // Nouveau champ pour la valeur du devis HT
});

export type BlankWorkSheetValues = z.infer<typeof blankWorkSheetSchema>;
