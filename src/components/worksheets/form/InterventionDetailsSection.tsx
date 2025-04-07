
import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Team } from '@/types/models';

interface InterventionDetailsSectionProps {
  teams: Team[];
  handleTeamFilterChange: (value: string) => void;
  handlePersonnelChange: (selectedPersonnel: string[]) => void;
}

const InterventionDetailsSection: React.FC<InterventionDetailsSectionProps> = ({
  teams,
  handleTeamFilterChange,
  handlePersonnelChange
}) => {
  const { control, watch } = useFormContext<BlankWorkSheetValues>();
  const teamFilter = watch('teamFilter');
  
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
          <Select value={teamFilter} onValueChange={handleTeamFilterChange}>
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
      
      <FormField
        control={control}
        name="workDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description des travaux</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez les travaux à effectuer..." 
                className="min-h-32" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Card>
        <CardContent className="pt-4">
          <FormField
            control={control}
            name="personnel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personnel</FormLabel>
                <FormControl>
                  <PersonnelDialog 
                    selectedPersonnel={field.value} 
                    onChange={handlePersonnelChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InterventionDetailsSection;
