
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

// Define the blank work sheet schema with more permissive validation
export const BlankWorkSheetSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().optional().default(''),
  address: z.string().optional().default(''),
  contactPhone: z.string().optional().default(''),
  contactEmail: z.string().optional().default(''),
  date: z.date(),
  personnel: z.array(z.string()).default([]),
  departure: z.string().optional().default(''),
  arrival: z.string().optional().default(''),
  end: z.string().optional().default(''),
  breakTime: z.string().optional().default(''),
  tasks: z.string().optional().default(''),
  wasteManagement: z.string().default('none'),
  notes: z.string().optional().default(''),
  clientSignature: z.string().nullable().optional(),
  consumables: z.array(ConsumableSchema).default([]),
  totalHours: z.number().default(0),
  hourlyRate: z.number().default(45),
  signedQuoteAmount: z.number().default(0),
  isQuoteSigned: z.boolean().default(false),
  linkedProjectId: z.string().nullable().optional(),
  teamFilter: z.string().optional(),
  vatRate: z.string().optional().default('20'),
  quoteValue: z.number().optional(),
  invoiced: z.boolean().default(false),
});

// Create a type from the schema
export type BlankWorkSheetValues = z.infer<typeof BlankWorkSheetSchema>;
