import { z } from 'zod'

// Common field validations
export const emailSchema = z
  .string()
  .email('Format d\'email invalide')
  .min(1, 'Email requis')

export const phoneSchema = z
  .string()
  .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Format de téléphone invalide')

export const urlSchema = z
  .string()
  .url('URL invalide')
  .or(z.literal(''))

export const positiveNumberSchema = z
  .number()
  .positive('Doit être un nombre positif')

export const nonNegativeNumberSchema = z
  .number()
  .min(0, 'Doit être supérieur ou égal à 0')

export const uuidSchema = z
  .string()
  .uuid('Format UUID invalide')

export const dateStringSchema = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), 'Date invalide')

export const timeStringSchema = z
  .string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)')

export const nameSchema = z
  .string()
  .min(2, 'Minimum 2 caractères')
  .max(100, 'Maximum 100 caractères')
  .trim()

export const addressSchema = z
  .string()
  .min(5, 'Adresse trop courte')
  .max(200, 'Maximum 200 caractères')
  .trim()

export const textSchema = z
  .string()
  .max(1000, 'Maximum 1000 caractères')
  .trim()

export const longTextSchema = z
  .string()
  .max(5000, 'Maximum 5000 caractères')
  .trim()