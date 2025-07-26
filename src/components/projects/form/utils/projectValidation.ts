
import { ProjectInfo } from '@/types/models';
import { validateRequired, validateForm, ValidationResult } from '@/utils/validationUtils';

export const validateProjectData = (
  data: Omit<ProjectInfo, 'id' | 'createdAt'>
): ValidationResult => {
  return validateForm([
    () => validateRequired(data.name, 'Le nom du chantier'),
    () => validateRequired(data.team, 'Une équipe')
  ]);
};
