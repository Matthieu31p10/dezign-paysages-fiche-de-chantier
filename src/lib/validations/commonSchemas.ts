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
  .refine(
    (val) => !/<script|javascript:|on\w+=/i.test(val),
    'Contenu non autorisé détecté'
  )

export const longTextSchema = z
  .string()
  .max(5000, 'Maximum 5000 caractères')
  .trim()
  .refine(
    (val) => !/<script|javascript:|on\w+=/i.test(val),
    'Contenu non autorisé détecté'
  )

// Schéma de validation pour les mots de passe sécurisés
export const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
  .refine(
    (val) => /[A-Z]/.test(val),
    'Le mot de passe doit contenir au moins une majuscule'
  )
  .refine(
    (val) => /[a-z]/.test(val),
    'Le mot de passe doit contenir au moins une minuscule'
  )
  .refine(
    (val) => /\d/.test(val),
    'Le mot de passe doit contenir au moins un chiffre'
  )
  .refine(
    (val) => /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\\/~`]/.test(val),
    'Le mot de passe doit contenir au moins un caractère spécial'
  )
  .refine(
    (val) => !/(.)\1{2,}/.test(val),
    'Le mot de passe ne doit pas contenir de caractères répétitifs'
  )
  .refine(
    (val) => !/123456|abcdef|qwerty|azerty|password|motdepasse/i.test(val),
    'Le mot de passe ne doit pas contenir de séquences communes'
  )