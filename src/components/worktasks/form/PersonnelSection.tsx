
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrashIcon } from 'lucide-react';

const PersonnelSection = () => {
  const form = useFormContext();
  const [newPerson, setNewPerson] = useState('');
  const [personnel, setPersonnel] = useState<string[]>(
    form.getValues('personnel') || []
  );

  const handleAddPerson = () => {
    if (newPerson.trim() && !personnel.includes(newPerson.trim())) {
      const updatedPersonnel = [...personnel, newPerson.trim()];
      setPersonnel(updatedPersonnel);
      form.setValue('personnel', updatedPersonnel);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (personToRemove: string) => {
    const updatedPersonnel = personnel.filter(person => person !== personToRemove);
    setPersonnel(updatedPersonnel);
    form.setValue('personnel', updatedPersonnel);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnel présent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {personnel.map((person, index) => (
            <Badge key={index} variant="secondary" className="p-1.5">
              {person}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => handleRemovePerson(person)}
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Nom du membre du personnel"
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddPerson}>
            Ajouter
          </Button>
        </div>
        
        {form.formState.errors.personnel && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.personnel.message as string}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonnelSection;
