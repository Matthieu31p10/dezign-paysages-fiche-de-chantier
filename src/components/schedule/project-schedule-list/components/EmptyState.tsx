
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const EmptyState: React.FC = React.memo(() => {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-12 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune date prévisionnelle
        </h3>
        <p className="text-gray-500">
          Aucune date prévisionnelle n'est programmée pour l'année sélectionnée.
        </p>
      </CardContent>
    </Card>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
