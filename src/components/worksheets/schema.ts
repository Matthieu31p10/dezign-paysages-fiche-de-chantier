
import { z } from 'zod';
import { Consumable } from '@/types/models';

export const blankWorkSheetSchema = z.object({
  clientName: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.string().length(0)),
  date: z.date(),
  personnel: z.array(z.string()).optional(),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  end: z.string().optional(),
  breakTime: z.string().optional(),
  totalHours: z.number().min(0).optional(),
  tasks: z.string().optional(),
  wasteManagement: z.string().optional(),
  notes: z.string().optional(),
  clientSignature: z.string().nullable().optional(),
  consumables: z.array(z.any()).optional(),
  hourlyRate: z.number().min(0).optional(),
  signedQuoteAmount: z.number().min(0).optional(),
  isQuoteSigned: z.boolean().optional(),
  linkedProjectId: z.string().nullable().optional(),
  teamFilter: z.string().optional(),
  vatRate: z.string().optional(),
  invoiced: z.boolean().optional(),
});

// Export le schema avec le nom correct
export { blankWorkSheetSchema as BlankWorkSheetSchema };

export type BlankWorkSheetValues = z.infer<typeof blankWorkSheetSchema>;
