import { z } from 'zod'
import { nameSchema, uuidSchema } from './commonSchemas'

export const teamCreateSchema = z.object({
  name: nameSchema,
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format de couleur invalide (ex: #FF0000)').optional()
})

export const teamUpdateSchema = teamCreateSchema.partial()

export const teamQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

// Personnel schemas
export const personnelCreateSchema = z.object({
  name: nameSchema,
  position: z.string().max(100).optional(),
  active: z.boolean().default(true)
})

export const personnelUpdateSchema = personnelCreateSchema.partial()

export const personnelQuerySchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
  position: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

// Project teams associations
export const projectTeamCreateSchema = z.object({
  project_id: uuidSchema,
  team_id: uuidSchema,
  is_primary: z.boolean().default(false)
})

export const projectTeamUpdateSchema = z.object({
  is_primary: z.boolean()
})

// Form validation schemas
export const teamFormSchema = z.object({
  name: nameSchema,
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format de couleur invalide').optional()
})

export const personnelFormSchema = z.object({
  name: nameSchema,
  position: z.string().max(100, 'Maximum 100 caractères').optional(),
  active: z.boolean()
})

export type TeamCreateInput = z.infer<typeof teamCreateSchema>
export type TeamUpdateInput = z.infer<typeof teamUpdateSchema>
export type TeamQueryInput = z.infer<typeof teamQuerySchema>
export type TeamFormInput = z.infer<typeof teamFormSchema>

export type PersonnelCreateInput = z.infer<typeof personnelCreateSchema>
export type PersonnelUpdateInput = z.infer<typeof personnelUpdateSchema>
export type PersonnelQueryInput = z.infer<typeof personnelQuerySchema>
export type PersonnelFormInput = z.infer<typeof personnelFormSchema>

export type ProjectTeamCreateInput = z.infer<typeof projectTeamCreateSchema>
export type ProjectTeamUpdateInput = z.infer<typeof projectTeamUpdateSchema>