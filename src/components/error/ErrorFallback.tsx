import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Quelque chose s'est mal passé",
  description = "Une erreur inattendue s'est produite. Veuillez réessayer.",
  showRetry = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {description}
        </p>
      </div>

      {error && process.env.NODE_ENV === 'development' && (
        <details className="max-w-lg w-full">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Détails de l'erreur (développement)
          </summary>
          <pre className="mt-2 p-2 bg-muted rounded text-xs text-left overflow-auto max-h-32">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {showRetry && resetError && (
        <Button onClick={resetError} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      )}
    </div>
  );
};

// Composants pré-configurés pour différents cas
export const LoadingErrorFallback: React.FC<{ resetError?: () => void }> = ({ resetError }) => (
  <ErrorFallback
    title="Erreur de chargement"
    description="Impossible de charger les données. Vérifiez votre connexion internet."
    resetError={resetError}
  />
);

export const FormErrorFallback: React.FC<{ resetError?: () => void }> = ({ resetError }) => (
  <ErrorFallback
    title="Erreur de formulaire"
    description="Une erreur s'est produite lors de la soumission. Veuillez vérifier vos données."
    resetError={resetError}
  />
);

export const NetworkErrorFallback: React.FC<{ resetError?: () => void }> = ({ resetError }) => (
  <ErrorFallback
    title="Erreur de connexion"
    description="Impossible de se connecter au serveur. Vérifiez votre connexion internet."
    resetError={resetError}
  />
);

export default ErrorFallback;