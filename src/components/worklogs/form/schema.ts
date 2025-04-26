
import { z } from 'zod';

export const formSchema = z.object({
  projectId: z.string().optional(),
  date: z.date(),
  personnel: z.array(z.string()),
  duration: z.number().optional(),
  notes: z.string().optional(),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  end: z.string().optional(),
  breakTime: z.string().optional(),
  totalHours: z.number().optional(),
  waterConsumption: z.number().optional(),
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
      quantity: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number()
    })
  ).optional().default([]),
});

export type FormValues = z.infer<typeof formSchema>;
