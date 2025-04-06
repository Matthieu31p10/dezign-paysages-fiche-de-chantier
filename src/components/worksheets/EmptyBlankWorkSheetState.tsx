
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileBarChart } from 'lucide-react';

const EmptyBlankWorkSheetState = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center flex flex-col items-center">
        <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mb-4">
          <FileBarChart className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <CardTitle className="text-xl mb-2">Aucune fiche vierge</CardTitle>
        
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Les fiches vierges vous permettent de suivre des travaux ponctuels sans les associer à un chantier spécifique.
        </p>
        
        <Button onClick={() => navigate('/blank-worksheets?tab=new')}>
          <Plus className="mr-2 h-4 w-4" />
          Créer une fiche vierge
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyBlankWorkSheetState;
