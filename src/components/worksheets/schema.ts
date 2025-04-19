
import { z } from 'zod';

// Create a schema for consumables
const ConsumableSchema = z.object({
  supplier: z.string().optional(),
  product: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.coerce.number().default(0),
  unitPrice: z.coerce.number().default(0),
  totalPrice: z.coerce.number().default(0),
});

// This is the main schema for blank worksheets
export const BlankWorkSheetSchema = z.object({
  // Client information
  clientName: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  
  // Intervention details
  date: z.date().default(() => new Date()),
  personnel: z.array(z.string()).default([]),
  teamFilter: z.string().default('all'),
  
  // Time tracking
  departure: z.string().optional(),
  arrival: z.string().optional(),
  end: z.string().optional(),
  breakTime: z.string().optional(),
  totalHours: z.number().default(0),
  
  // Tasks and notes
  tasks: z.string().optional(),
  wasteManagement: z.string().default('none'),
  notes: z.string().optional(),
  
  // Client signature
  clientSignature: z.string().nullable().optional(),
  
  // Materials and consumables
  consumables: z.array(ConsumableSchema).default([]),
  
  // Financial information
  hourlyRate: z.number().default(45),
  signedQuoteAmount: z.number().default(0),
  isQuoteSigned: z.boolean().default(false),
  
  // Project linking
  linkedProjectId: z.string().nullable().optional(),
  
  // Invoicing
  invoiced: z.boolean().default(false),
});

// Type for Blank Worksheet form values
export type BlankWorkSheetValues = z.infer<typeof BlankWorkSheetSchema>;
