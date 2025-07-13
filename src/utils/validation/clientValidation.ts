import { z } from 'zod'
import { toast } from '@/hooks/use-toast'

// Error formatting utilities
export const formatZodError = (error: z.ZodError): Record<string, string> => {
  const errorMap: Record<string, string> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errorMap[path] = err.message
  })
  
  return errorMap
}

export const getFirstErrorMessage = (error: z.ZodError): string => {
  return error.errors[0]?.message || 'Erreur de validation'
}

// Validation result type
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: Record<string, string>
  message?: string
}

// Generic validation function
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: {
    showToast?: boolean
    toastTitle?: string
    toastDescription?: string
  } = {}
): ValidationResult<T> => {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = formatZodError(error)
      const message = getFirstErrorMessage(error)
      
      if (options.showToast) {
        toast({
          title: options.toastTitle || 'Erreur de validation',
          description: options.toastDescription || message,
          variant: 'destructive'
        })
      }
      
      return {
        success: false,
        errors,
        message
      }
    }
    
    // Non-Zod error
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    
    if (options.showToast) {
      toast({
        title: options.toastTitle || 'Erreur',
        description: message,
        variant: 'destructive'
      })
    }
    
    return {
      success: false,
      message
    }
  }
}

// Async validation function for complex validations
export const validateDataAsync = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  asyncValidators: Array<(data: T) => Promise<boolean>> = [],
  options: {
    showToast?: boolean
    toastTitle?: string
    toastDescription?: string
  } = {}
): Promise<ValidationResult<T>> => {
  // First, validate with Zod schema
  const basicValidation = validateData(schema, data, { showToast: false })
  
  if (!basicValidation.success) {
    if (options.showToast) {
      toast({
        title: options.toastTitle || 'Erreur de validation',
        description: options.toastDescription || basicValidation.message,
        variant: 'destructive'
      })
    }
    return basicValidation
  }
  
  // Then, run async validators
  try {
    for (const validator of asyncValidators) {
      const isValid = await validator(basicValidation.data!)
      if (!isValid) {
        const message = 'Validation asynchrone échouée'
        
        if (options.showToast) {
          toast({
            title: options.toastTitle || 'Erreur de validation',
            description: options.toastDescription || message,
            variant: 'destructive'
          })
        }
        
        return {
          success: false,
          message
        }
      }
    }
    
    return basicValidation
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur de validation asynchrone'
    
    if (options.showToast) {
      toast({
        title: options.toastTitle || 'Erreur de validation',
        description: message,
        variant: 'destructive'
      })
    }
    
    return {
      success: false,
      message
    }
  }
}

// Form field validation
export const validateField = <T>(
  fieldName: keyof T,
  value: unknown,
  schema: z.ZodSchema<T>
): { isValid: boolean; error?: string } => {
  try {
    // Try to validate just this field by creating a partial object
    const partialData = { [fieldName]: value } as Partial<T>
    
    // Get the field schema
    if ('shape' in schema && schema.shape && typeof schema.shape === 'object') {
      const fieldSchema = (schema.shape as any)[fieldName]
      if (fieldSchema) {
        fieldSchema.parse(value)
      }
    }
    
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: getFirstErrorMessage(error)
      }
    }
    return {
      isValid: false,
      error: 'Erreur de validation'
    }
  }
}

// Debounced validation for real-time field validation
export const createDebouncedValidator = <T>(
  fieldName: keyof T,
  schema: z.ZodSchema<T>,
  onValidation: (isValid: boolean, error?: string) => void,
  delay: number = 300
) => {
  let timeoutId: NodeJS.Timeout
  
  return (value: unknown) => {
    clearTimeout(timeoutId)
    
    timeoutId = setTimeout(() => {
      const result = validateField(fieldName, value, schema)
      onValidation(result.isValid, result.error)
    }, delay)
  }
}