
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error?: Error;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = React.memo(({ error, onRetry }) => {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-500 mb-4">
          {error?.message || 'Une erreur est survenue lors du chargement des données.'}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
