import { errorHandler } from './error';
import { ErrorType } from './error/types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

/**
 * Validate required string fields
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      errorMessage: `${fieldName} est requis`
    };
  }
  return { isValid: true, errorMessage: '' };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: true, errorMessage: '' }; // Email is optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: 'Format d\'email invalide'
    };
  }
  
  return { isValid: true, errorMessage: '' };
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true, errorMessage: '' }; // Phone is optional
  }
  
  const phoneRegex = /^[\d\s\-\+\(\)\.]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      errorMessage: 'Format de téléphone invalide'
    };
  }
  
  return { isValid: true, errorMessage: '' };
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: number, fieldName: string): ValidationResult => {
  if (value <= 0) {
    return {
      isValid: false,
      errorMessage: `${fieldName} doit être un nombre positif`
    };
  }
  return { isValid: true, errorMessage: '' };
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate: string, endDate: string): ValidationResult => {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return {
      isValid: false,
      errorMessage: 'La date de fin doit être postérieure à la date de début'
    };
  }
  return { isValid: true, errorMessage: '' };
};

/**
 * Validate form with multiple validation functions
 */
export const validateForm = (validations: Array<() => ValidationResult>): ValidationResult => {
  for (const validation of validations) {
    try {
      const result = validation();
      if (!result.isValid) {
        return result;
      }
    } catch (error) {
      errorHandler.handle(error, {
        context: { type: ErrorType.VALIDATION, operation: 'validateForm' }
      });
      return {
        isValid: false,
        errorMessage: 'Erreur lors de la validation'
      };
    }
  }
  return { isValid: true, errorMessage: '' };
};