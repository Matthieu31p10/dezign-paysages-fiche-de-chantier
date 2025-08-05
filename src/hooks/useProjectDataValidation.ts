import { useCallback, useMemo } from 'react';
import { ProjectInfo } from '@/types/models';
import { toast } from 'sonner';

interface ValidationRule {
  field: keyof ProjectInfo;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, project: ProjectInfo) => boolean | string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

const defaultValidationRules: ValidationRule[] = [
  {
    field: 'name',
    required: true,
    minLength: 2,
    maxLength: 100
  },
  {
    field: 'address',
    required: true,
    minLength: 5,
    maxLength: 200
  },
  {
    field: 'contactEmail',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value, project) => {
      if (value && !value.includes('@')) {
        return 'Email invalide';
      }
      return true;
    }
  },
  {
    field: 'contactPhone',
    pattern: /^[\+]?[0-9\s\-\(\)]{8,15}$/,
    custom: (value) => {
      if (value && value.length < 8) {
        return 'Numéro de téléphone trop court';
      }
      return true;
    }
  },
  {
    field: 'annualTotalHours',
    custom: (value) => {
      if (value && (value < 0 || value > 8760)) {
        return 'Les heures annuelles doivent être entre 0 et 8760';
      }
      return true;
    }
  },
  {
    field: 'annualVisits',
    custom: (value) => {
      if (value && (value < 0 || value > 365)) {
        return 'Les visites annuelles doivent être entre 0 et 365';
      }
      return true;
    }
  }
];

export const useProjectDataValidation = (customRules: ValidationRule[] = []) => {
  const validationRules = useMemo(() => 
    [...defaultValidationRules, ...customRules], 
    [customRules]
  );

  const validateField = useCallback((
    field: keyof ProjectInfo, 
    value: any, 
    project: ProjectInfo
  ): { isValid: boolean; error?: string; warning?: string } => {
    const rule = validationRules.find(r => r.field === field);
    if (!rule) return { isValid: true };

    // Required check
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return { isValid: false, error: `${field} est requis` };
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { isValid: true };
    }

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return { isValid: false, error: `${field} doit contenir au moins ${rule.minLength} caractères` };
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        return { isValid: false, error: `${field} ne peut pas dépasser ${rule.maxLength} caractères` };
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        return { isValid: false, error: `Format invalide pour ${field}` };
      }
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value, project);
      if (result !== true) {
        return { isValid: false, error: typeof result === 'string' ? result : `Validation échouée pour ${field}` };
      }
    }

    return { isValid: true };
  }, [validationRules]);

  const validateProject = useCallback((project: Partial<ProjectInfo>): ValidationResult => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    let isValid = true;

    validationRules.forEach(rule => {
      const field = rule.field;
      const value = project[field];
      const validation = validateField(field, value, project as ProjectInfo);
      
      if (!validation.isValid && validation.error) {
        errors[field] = validation.error;
        isValid = false;
      }
      
      if (validation.warning) {
        warnings[field] = validation.warning;
      }
    });

    // Cross-field validations
    if (project.startDate && project.endDate) {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      if (start > end) {
        errors.endDate = 'La date de fin doit être après la date de début';
        isValid = false;
      }
    }

    if (project.annualTotalHours && project.annualVisits) {
      const avgHoursPerVisit = project.annualTotalHours / project.annualVisits;
      if (avgHoursPerVisit > 24) {
        warnings.annualTotalHours = 'Moyenne de plus de 24h par visite';
      }
    }

    return { isValid, errors, warnings };
  }, [validationRules, validateField]);

  const validateBeforeSave = useCallback((project: Partial<ProjectInfo>): boolean => {
    const validation = validateProject(project);
    
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors);
      toast.error(`Erreurs de validation: ${errorMessages.join(', ')}`);
      return false;
    }

    if (Object.keys(validation.warnings).length > 0) {
      const warningMessages = Object.values(validation.warnings);
      toast.warning(`Avertissements: ${warningMessages.join(', ')}`);
    }

    return true;
  }, [validateProject]);

  const getFieldValidationStatus = useCallback((
    field: keyof ProjectInfo, 
    value: any, 
    project: ProjectInfo
  ) => {
    return validateField(field, value, project);
  }, [validateField]);

  return {
    validateProject,
    validateField,
    validateBeforeSave,
    getFieldValidationStatus,
    validationRules
  };
};