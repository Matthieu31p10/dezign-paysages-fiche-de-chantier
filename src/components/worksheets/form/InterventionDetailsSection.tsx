
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSettings } from '@/context/SettingsContext';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';

const InterventionDetailsSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const { teams } = useApp();
  const { getPersonnel } = useSettings();
  const teamFilterValue = watch('teamFilter') || 'all';
  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const selectedPersonnel = watch('personnel') || [];
  
  const handleTeamFilterChange = (value: string) => {
    setValue('teamFilter', value);
  };
  
  const handlePersonnelChange = (selectedPersonnel: string[]) => {
    setValue('personnel', selectedPersonnel);
  };
  
  const availablePersonnel = getPersonnel()
    .filter(p => p.active)
    .map(p => p.name);
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
        Détails de l'intervention
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Équipe</FormLabel>
          <Select value={teamFilterValue} onValueChange={handleTeamFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une équipe (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les équipes</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <FormField
            control={control}
            name="personnel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personnel</FormLabel>
                <FormControl>
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setPersonnelDialogOpen(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      {selectedPersonnel.length > 0
                        ? `${selectedPersonnel.length} personne(s) sélectionnée(s)`
                        : "Sélectionner le personnel"}
                    </Button>
                    
                    {selectedPersonnel.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedPersonnel.map((name) => (
                          <div
                            key={name}
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <PersonnelDialog
            isOpen={personnelDialogOpen}
            onOpenChange={setPersonnelDialogOpen}
            selectedPersonnel={selectedPersonnel}
            onChange={handlePersonnelChange}
            availablePersonnel={availablePersonnel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InterventionDetailsSection;
