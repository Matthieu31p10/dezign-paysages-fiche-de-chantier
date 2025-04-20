
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';

interface PersonnelSectionProps {
  control: Control<BlankWorkSheetValues>;
  selectedPersonnel: string[];
  onPersonnelChange: (selectedPersonnel: string[]) => void;
}

export const PersonnelSection: React.FC<PersonnelSectionProps> = ({
  control,
  selectedPersonnel,
  onPersonnelChange
}) => {
  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="text-sm font-medium mb-4 flex items-center">
          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
          Personnel Présent
        </h3>
        <FormField
          control={control}
          name="personnel"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PersonnelDialog
                  selectedPersonnel={selectedPersonnel}
                  onChange={onPersonnelChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
