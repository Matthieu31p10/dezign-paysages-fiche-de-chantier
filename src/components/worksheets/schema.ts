
import * as z from 'zod';

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
  wasteManagement: z.string().default('none'),
  teamFilter: z.string().optional(),
  linkedProjectId: z.string().optional(),
  notes: z.string().optional(),
  tasks: z.string().optional(),
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
  quoteValue: z.number().optional(), // Champ pour la valeur du devis HT
});

export type BlankWorkSheetValues = z.infer<typeof blankWorkSheetSchema>;
