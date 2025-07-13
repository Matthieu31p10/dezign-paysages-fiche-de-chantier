import { z } from 'zod'
import { nameSchema, positiveNumberSchema, nonNegativeNumberSchema, uuidSchema } from './commonSchemas'

export const consumableCreateSchema = z.object({
  product: nameSchema,
  supplier: nameSchema,
  quantity: positiveNumberSchema,
  unit: z.string().min(1, 'Unité requise').max(20, 'Maximum 20 caractères'),
  unit_price: positiveNumberSchema,
  total_price: positiveNumberSchema,
  saved_for_reuse: z.boolean().optional(),
  work_log_id: uuidSchema.optional()
})

export const consumableUpdateSchema = consumableCreateSchema.partial()

export const consumableQuerySchema = z.object({
  work_log_id: uuidSchema.optional(),
  product: z.string().optional(),
  supplier: z.string().optional(),
  saved_for_reuse: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
})

// Blank worksheet consumables
export const blankWorksheetConsumableCreateSchema = z.object({
  product: nameSchema,
  supplier: nameSchema,
  quantity: positiveNumberSchema,
  unit: z.string().min(1, 'Unité requise').max(20, 'Maximum 20 caractères'),
  unit_price: positiveNumberSchema,
  total_price: positiveNumberSchema,
  saved_for_reuse: z.boolean().optional(),
  blank_worksheet_id: uuidSchema.optional()
})

export const blankWorksheetConsumableUpdateSchema = blankWorksheetConsumableCreateSchema.partial()

// Saved consumables (reusable items)
export const savedConsumableCreateSchema = z.object({
  product: nameSchema,
  supplier: nameSchema,
  quantity: positiveNumberSchema,
  unit: z.string().min(1, 'Unité requise').max(20, 'Maximum 20 caractères'),
  unit_price: positiveNumberSchema,
  total_price: positiveNumberSchema,
  saved_for_reuse: z.boolean().default(true)
})

export const savedConsumableUpdateSchema = savedConsumableCreateSchema.partial()

// Form validation schemas
export const consumableFormSchema = z.object({
  product: nameSchema,
  supplier: nameSchema,
  quantity: z.number().min(0.01, 'Quantité minimum 0.01'),
  unit: z.string().min(1, 'Unité requise').max(20, 'Maximum 20 caractères'),
  unitPrice: z.number().min(0.01, 'Prix unitaire minimum 0.01'),
  totalPrice: z.number().min(0.01, 'Prix total minimum 0.01'),
  savedForReuse: z.boolean()
}).refine((data) => {
  // Vérifier que le prix total correspond à quantité × prix unitaire
  const calculatedTotal = data.quantity * data.unitPrice
  const tolerance = 0.01 // Tolérance pour les erreurs d'arrondi
  return Math.abs(data.totalPrice - calculatedTotal) <= tolerance
}, {
  message: 'Le prix total doit correspondre à la quantité × prix unitaire',
  path: ['totalPrice']
})

export type ConsumableCreateInput = z.infer<typeof consumableCreateSchema>
export type ConsumableUpdateInput = z.infer<typeof consumableUpdateSchema>
export type ConsumableQueryInput = z.infer<typeof consumableQuerySchema>
export type ConsumableFormInput = z.infer<typeof consumableFormSchema>

export type BlankWorksheetConsumableCreateInput = z.infer<typeof blankWorksheetConsumableCreateSchema>
export type BlankWorksheetConsumableUpdateInput = z.infer<typeof blankWorksheetConsumableUpdateSchema>

export type SavedConsumableCreateInput = z.infer<typeof savedConsumableCreateSchema>
export type SavedConsumableUpdateInput = z.infer<typeof savedConsumableUpdateSchema>