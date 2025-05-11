
import { ProjectInfo } from '@/types/models';

type ValidationResult = {
  isValid: boolean;
  errorMessage: string;
};

export const validateProjectData = (
  data: Omit<ProjectInfo, 'id' | 'createdAt'>
): ValidationResult => {
  if (!data.name) {
    return {
      isValid: false,
      errorMessage: 'Le nom du chantier est requis'
    };
  }

  if (!data.team) {
    return {
      isValid: false,
      errorMessage: 'Une équipe doit être sélectionnée'
    };
  }

  return { isValid: true, errorMessage: '' };
};
