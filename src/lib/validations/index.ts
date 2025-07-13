// Re-export all validation schemas
export * from './projectSchemas'
export * from './workLogSchemas'
export * from './teamSchemas'
export * from './consumableSchemas'
export * from './commonSchemas'

// Common validation utilities
export const validateRequired = (value: unknown, fieldName: string) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} est requis`)
  }
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Format d\'email invalide')
  }
}

export const validatePhone = (phone: string) => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  if (!phoneRegex.test(phone)) {
    throw new Error('Format de téléphone invalide')
  }
}