import { ErrorType, ErrorContext } from './types';

export const getErrorMessage = (error: Error, context?: ErrorContext): string => {
  const type = context?.type || ErrorType.UNKNOWN;
  
  // Supabase specific errors
  if (error.message.includes('PGRST') || error.message.includes('row level security')) {
    return 'Erreur d\'accès aux données. Vérifiez vos permissions.';
  }
  
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return 'Erreur de connexion. Vérifiez votre connexion internet.';
  }

  switch (type) {
    case ErrorType.AUTHENTICATION:
      return 'Erreur d\'authentification. Veuillez vous reconnecter.';
    case ErrorType.DATABASE:
      return 'Erreur de base de données. L\'opération a échoué.';
    case ErrorType.NETWORK:
      return 'Erreur de réseau. Vérifiez votre connexion.';
    case ErrorType.VALIDATION:
      return 'Données invalides. Vérifiez vos saisies.';
    case ErrorType.FILE_UPLOAD:
      return 'Erreur lors du téléchargement du fichier.';
    case ErrorType.PERMISSION:
      return 'Permissions insuffisantes pour cette opération.';
    default:
      return 'Une erreur s\'est produite. Veuillez réessayer.';
  }
};