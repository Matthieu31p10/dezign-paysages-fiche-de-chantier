
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';
import { Users } from 'lucide-react';

interface InterventionDetailsSectionProps {
  availablePersonnel?: string[];
}

const InterventionDetailsSection: React.FC<InterventionDetailsSectionProps> = ({
  availablePersonnel = []
}) => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const selectedPersonnel = watch('personnel') || [];
  
  const handlePersonnelChange = (selected: string[]) => {
    setValue('personnel', selected);
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Détails de l'intervention</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Personnel</label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setPersonnelDialogOpen(true)}
              className="text-xs h-7 py-0 px-2"
            >
              <Users className="h-3.5 w-3.5 mr-1" />
              Sélectionner
            </Button>
          </div>
          
          {selectedPersonnel.length > 0 ? (
            <div className="border rounded-md p-2 bg-slate-50">
              <ul className="grid grid-cols-2 gap-2">
                {selectedPersonnel.map((person) => (
                  <li key={person} className="text-sm bg-white px-2 py-1 rounded border">
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground border rounded-md p-3 bg-slate-50">
              Aucun personnel sélectionné
            </div>
          )}
        </div>
      </CardContent>
      
      <PersonnelDialog 
        isOpen={personnelDialogOpen}
        onOpenChange={setPersonnelDialogOpen}
        selectedPersonnel={selectedPersonnel}
        onChange={handlePersonnelChange}
        availablePersonnel={availablePersonnel}
      />
    </Card>
  );
};

export default InterventionDetailsSection;
