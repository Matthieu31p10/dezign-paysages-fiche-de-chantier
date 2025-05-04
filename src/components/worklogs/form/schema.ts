
import { z } from 'zod';

export const formSchema = z.object({
  projectId: z.string().optional(),
  date: z.date(),
  personnel: z.array(z.string()),
  duration: z.coerce.number().optional().default(0),
  notes: z.string().optional(),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  end: z.string().optional(),
  breakTime: z.string().optional(),
  totalHours: z.coerce.number().optional().default(0),
  waterConsumption: z.coerce.number().optional().default(0),
  teamFilter: z.string().optional(),
  watering: z.enum(['none', 'on', 'off']).optional(),
  customTasks: z.record(z.boolean()).optional(),
  tasksProgress: z.record(z.number()).optional(),
  wasteManagement: z.enum(['none', 'keep', 'remove']).optional(),
  invoiced: z.boolean().optional().default(false),
  consumables: z.array(
    z.object({
      id: z.string().optional(),
      supplier: z.string(),
      product: z.string(),
      unit: z.string(),
      quantity: z.coerce.number(),
      unitPrice: z.coerce.number(),
      totalPrice: z.coerce.number()
    })
  ).optional().default([]),
  // Add additional properties that can be used for blank worksheets
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
