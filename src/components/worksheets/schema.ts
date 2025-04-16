
import { z } from 'zod';

// Create a schema for consumables
const ConsumableSchema = z.object({
  id: z.string().optional(),
  supplier: z.string().optional(),
  product: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.number().default(0),
  unitPrice: z.number().default(0),
  totalPrice: z.number().default(0),
});

// Define the blank work sheet schema
export const BlankWorkSheetSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  date: z.date(),
  personnel: z.array(z.string()).default([]),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  end: z.string().optional(),
  breakTime: z.string().optional(),
  tasks: z.string().optional(),
  wasteManagement: z.string().default('none'),
  notes: z.string().optional(),
  clientSignature: z.string().nullable().optional(),
  consumables: z.array(ConsumableSchema).default([]),
  totalHours: z.number().default(0),
  hourlyRate: z.number().default(0),
  signedQuoteAmount: z.number().default(0),
  isQuoteSigned: z.boolean().default(false),
  linkedProjectId: z.string().nullable().optional(),
  teamFilter: z.string().optional(),
  vatRate: z.string().optional().default('20'),
  quoteValue: z.number().optional(),
  invoiced: z.boolean().default(false), // Added missing invoiced field
});

// Create a type from the schema
export type BlankWorkSheetValues = z.infer<typeof BlankWorkSheetSchema>;
