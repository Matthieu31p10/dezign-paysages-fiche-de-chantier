
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

interface EmptyBlankWorkSheetStateProps {
  onCreateNew: () => void;
}

const EmptyBlankWorkSheetState: React.FC<EmptyBlankWorkSheetStateProps> = ({ onCreateNew }) => {
  return (
    <Card className="border-dashed bg-muted/50">
      <CardHeader className="pb-0">
        <h3 className="text-lg font-medium text-center">Aucune fiche vierge</h3>
      </CardHeader>
      <CardContent className="pb-2 pt-6 flex justify-center">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-4">
            <FilePlus className="h-16 w-16 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Les fiches vierges vous permettent de documenter des interventions ponctuelles
            sans lien avec un projet existant. Créez votre première fiche vierge pour commencer.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button onClick={onCreateNew} className="min-w-32">
          <FilePlus className="h-4 w-4 mr-2" />
          Créer une fiche vierge
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyBlankWorkSheetState;
