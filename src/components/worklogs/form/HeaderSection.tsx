
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectInfo, Team } from '@/types/models';
import { useWorkLogForm } from './WorkLogFormContext';
import { Card, CardContent } from '@/components/ui/card';
import PersonnelDialog from '@/components/worklogs/PersonnelDialog';

interface HeaderSectionProps {
  teams: Team[];
  filteredProjects: ProjectInfo[];
  handleTeamFilterChange: (teamId: string) => void;
  handlePersonnelChange: (personnel: string[]) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  teams,
  filteredProjects,
  handleTeamFilterChange,
  handlePersonnelChange
}) => {
  const { form } = useWorkLogForm();
  const { control, watch } = form;
  
  const selectedPersonnel = watch('personnel') || [];
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-green-800 flex items-center">
        <MapPin className="mr-2 h-4 w-4 text-green-600" />
        Informations générales
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <FormField
          control={control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-green-700">Projet</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9 border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-green-700">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-9 pl-3 text-left font-normal border-green-200 focus:border-green-500",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy", { locale: fr })
                      ) : (
                        <span>Date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-green-700">Durée (jours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className="h-9 border-green-200 focus:border-green-500"
                  placeholder="1.5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="teamFilter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-green-700">Équipe</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                handleTeamFilterChange(value);
              }} value={field.value || "all"}>
                <FormControl>
                  <SelectTrigger className="h-9 border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Card className="border-green-100">
        <CardContent className="p-3">
          <FormField
            control={control}
            name="personnel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-green-700 flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Personnel présent
                </FormLabel>
                <FormControl>
                  <PersonnelDialog 
                    selectedPersonnel={selectedPersonnel}
                    onChange={(personnel) => {
                      field.onChange(personnel);
                      handlePersonnelChange(personnel);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedPersonnel.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedPersonnel.map((person) => (
                <div 
                  key={person} 
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs"
                >
                  {person}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderSection;
