import { z } from 'zod'
import { 
  emailSchema, 
  phoneSchema, 
  nameSchema, 
  addressSchema, 
  textSchema, 
  longTextSchema,
  positiveNumberSchema,
  urlSchema,
  dateStringSchema
} from './commonSchemas'

export const projectTypeSchema = z.enum(['residence', 'particular', 'company'])
export const irrigationTypeSchema = z.enum(['none', 'manual', 'automatic'])
export const mowerTypeSchema = z.enum(['manual', 'robotic', 'both'])

export const projectCreateSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  client_name: nameSchema.optional(),
  contact_name: nameSchema.optional(),
  contact_phone: phoneSchema.optional(),
  contact_email: emailSchema.optional(),
  project_type: projectTypeSchema.optional(),
  irrigation: irrigationTypeSchema.optional(),
  mower_type: mowerTypeSchema.optional(),
  annual_visits: positiveNumberSchema.optional(),
  annual_total_hours: positiveNumberSchema.optional(),
  visit_duration: positiveNumberSchema.optional(),
  start_date: dateStringSchema.optional(),
  end_date: dateStringSchema.optional(),
  contract_details: longTextSchema.optional(),
  contract_document_url: urlSchema.optional(),
  additional_info: longTextSchema.optional()
})

export const projectUpdateSchema = projectCreateSchema.partial()

export const projectQuerySchema = z.object({
  search: z.string().optional(),
  project_type: projectTypeSchema.optional(),
  is_archived: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

// Form validation schemas
export const projectFormSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  clientName: nameSchema.optional(),
  contactName: nameSchema.optional(),
  contactPhone: phoneSchema.optional(),
  contactEmail: emailSchema.optional(),
  projectType: projectTypeSchema.optional(),
  irrigation: irrigationTypeSchema.optional(),
  mowerType: mowerTypeSchema.optional(),
  annualVisits: z.number().min(1).max(1000).optional(),
  annualTotalHours: z.number().min(1).max(10000).optional(),
  visitDuration: z.number().min(15).max(480).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  contractDetails: longTextSchema.optional(),
  contractDocumentUrl: urlSchema.optional(),
  additionalInfo: longTextSchema.optional()
}).refine((data) => {
  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    return false
  }
  return true
}, {
  message: 'La date de fin doit être postérieure à la date de début',
  path: ['endDate']
})

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>
export type ProjectFormInput = z.infer<typeof projectFormSchema>