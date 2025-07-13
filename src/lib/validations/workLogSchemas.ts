import { z } from 'zod'
import { 
  addressSchema, 
  nameSchema, 
  emailSchema, 
  phoneSchema,
  textSchema,
  longTextSchema,
  positiveNumberSchema,
  nonNegativeNumberSchema,
  uuidSchema,
  dateStringSchema,
  timeStringSchema
} from './commonSchemas'

export const workLogCreateSchema = z.object({
  project_id: uuidSchema,
  date: dateStringSchema,
  personnel: z.array(z.string()).min(1, 'Au moins un membre du personnel requis'),
  total_hours: positiveNumberSchema,
  arrival: z.string().optional(),
  departure: z.string().optional(),
  break_time: z.string().optional(),
  end_time: z.string().optional(),
  tasks: longTextSchema.optional(),
  notes: longTextSchema.optional(),
  address: addressSchema.optional(),
  client_name: nameSchema.optional(),
  contact_phone: phoneSchema.optional(),
  contact_email: emailSchema.optional(),
  hourly_rate: positiveNumberSchema.optional(),
  water_consumption: nonNegativeNumberSchema.optional(),
  waste_management: textSchema.optional(),
  is_quote_signed: z.boolean().optional(),
  signed_quote_amount: positiveNumberSchema.optional(),
  client_signature: z.string().optional(),
  invoiced: z.boolean().optional(),
  linked_project_id: uuidSchema.optional()
})

export const workLogUpdateSchema = workLogCreateSchema.partial()

export const workLogQuerySchema = z.object({
  project_id: uuidSchema.optional(),
  date_from: dateStringSchema.optional(),
  date_to: dateStringSchema.optional(),
  personnel: z.string().optional(),
  invoiced: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

// Form validation schemas
export const workLogFormSchema = z.object({
  projectId: uuidSchema,
  date: z.date(),
  personnel: z.array(z.string()).min(1, 'Au moins un membre du personnel requis'),
  totalHours: z.number().min(0.1).max(24),
  arrival: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  departure: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  breakTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  tasks: longTextSchema.optional(),
  notes: longTextSchema.optional(),
  address: addressSchema.optional(),
  clientName: nameSchema.optional(),
  contactPhone: phoneSchema.optional(),
  contactEmail: emailSchema.optional(),
  hourlyRate: z.number().min(0).optional(),
  waterConsumption: z.number().min(0).optional(),
  wasteManagement: textSchema.optional(),
  isQuoteSigned: z.boolean().optional(),
  signedQuoteAmount: z.number().min(0).optional(),
  clientSignature: z.string().optional(),
  invoiced: z.boolean().optional()
}).refine((data) => {
  if (data.arrival && data.departure && data.arrival >= data.departure) {
    return false
  }
  return true
}, {
  message: 'L\'heure de départ doit être postérieure à l\'heure d\'arrivée',
  path: ['departure']
})

export type WorkLogCreateInput = z.infer<typeof workLogCreateSchema>
export type WorkLogUpdateInput = z.infer<typeof workLogUpdateSchema>
export type WorkLogQueryInput = z.infer<typeof workLogQuerySchema>
export type WorkLogFormInput = z.infer<typeof workLogFormSchema>