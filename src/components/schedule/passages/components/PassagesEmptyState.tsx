
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const PassagesEmptyState: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">Aucun passage planifié</h3>
        <p className="text-gray-600">
          Aucun passage n'est planifié pour la période sélectionnée.
        </p>
      </CardContent>
    </Card>
  );
};

export default PassagesEmptyState;
