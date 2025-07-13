import { useState, useCallback } from 'react'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'

interface ValidationOptions {
  showToast?: boolean
  toastTitle?: string
}

export const useValidation = <T>(schema: z.ZodSchema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValid, setIsValid] = useState(true)

  const validate = useCallback((
    data: unknown, 
    options: ValidationOptions = {}
  ): data is T => {
    try {
      schema.parse(data)
      setErrors({})
      setIsValid(true)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {}
        
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          errorMap[path] = err.message
        })
        
        setErrors(errorMap)
        setIsValid(false)
        
        if (options.showToast) {
          toast({
            title: options.toastTitle || 'Erreur de validation',
            description: 'Veuillez corriger les erreurs dans le formulaire',
            variant: 'destructive'
          })
        }
      }
      return false
    }
  }, [schema])

  const validateField = useCallback((
    fieldName: string, 
    value: unknown
  ): boolean => {
    try {
      // Extract field schema from the main schema if it's a ZodObject
      if ('shape' in schema && schema.shape && typeof schema.shape === 'object') {
        const fieldSchema = (schema.shape as any)[fieldName]
        if (!fieldSchema) return true
        
        fieldSchema.parse(value)
      } else {
        // For non-object schemas, validate the entire value
        schema.parse(value)
      }
      
      // Remove error for this field if validation passes
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
      
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error.errors[0]?.message || 'Erreur de validation'
        }))
      }
      return false
    }
  }, [schema])

  const clearErrors = useCallback(() => {
    setErrors({})
    setIsValid(true)
  }, [])

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName]
  }, [errors])

  const hasFieldError = useCallback((fieldName: string) => {
    return Boolean(errors[fieldName])
  }, [errors])

  return {
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    errors,
    isValid,
    hasErrors: Object.keys(errors).length > 0
  }
}

// Helper hook for form validation with react-hook-form integration
export const useFormValidation = <T>(schema: z.ZodSchema<T>) => {
  const validation = useValidation(schema)

  const validateOnSubmit = useCallback((data: unknown) => {
    return validation.validate(data, {
      showToast: true,
      toastTitle: 'Erreur de validation du formulaire'
    })
  }, [validation])

  const validateOnBlur = useCallback((fieldName: string, value: unknown) => {
    return validation.validateField(fieldName, value)
  }, [validation])

  return {
    ...validation,
    validateOnSubmit,
    validateOnBlur
  }
}