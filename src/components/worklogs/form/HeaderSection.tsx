
import React from 'react';
import { useWorkLogForm } from './WorkLogFormContext';
import { Team } from '@/types/models';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ProjectInfo } from '@/types/models';
import PersonnelDialog from '../PersonnelDialog';

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
  const { form, selectedProject } = useWorkLogForm();
  const { control, watch, setValue } = form;
  
  const personnelDialogOpen = watch('personnelDialogOpen') || false;
  const selectedPersonnel = watch('personnel') || [];
  const teamFilter = watch('teamFilter') || 'all';
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="teamFilter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Équipe</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleTeamFilterChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une équipe" />
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
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projet</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name || 'Projet sans nom'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

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
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
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
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée (jours)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="Durée en jours"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personnel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personnel</FormLabel>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setValue('personnelDialogOpen', true)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {selectedPersonnel.length > 0
                    ? `${selectedPersonnel.length} personne(s) sélectionnée(s)`
                    : "Sélectionner le personnel"}
                </Button>
                
                <PersonnelDialog
                  open={personnelDialogOpen}
                  onOpenChange={(open) => setValue('personnelDialogOpen', open)}
                  selected={selectedPersonnel}
                  onSelect={handlePersonnelChange}
                />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default HeaderSection;
