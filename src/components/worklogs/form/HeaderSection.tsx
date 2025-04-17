
import React from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, FileSpreadsheet, Users } from 'lucide-react';
import { cn } from "@/lib/utils";
import { addDays } from 'date-fns';
import { formatDate } from '@/utils/date';
import { ProjectInfo, Team } from '@/types/models';
import PersonnelDialog from '../PersonnelDialog';
import { useWorkLogForm } from './WorkLogFormContext';

interface HeaderSectionProps {
  teams: Team[];
  filteredProjects: ProjectInfo[];
  handleTeamFilterChange: (team: string) => void;
  handlePersonnelChange: (personnel: string[]) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  teams,
  filteredProjects,
  handleTeamFilterChange,
  handlePersonnelChange
}) => {
  const { form } = useWorkLogForm();
  const { control, watch, formState: { errors } } = form;
  
  const dateValue = watch("date");
  const selectedPersonnel = watch("personnel") || []; // Add fallback empty array to prevent undefined
  const duration = watch("duration");
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="teamFilter" className="text-green-700">Filtrer par équipe</Label>
          <Controller
            name="teamFilter"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => handleTeamFilterChange(value)}
                value={field.value}
              >
                <SelectTrigger className="border-green-200 bg-white">
                  <SelectValue placeholder="Toutes les équipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-teams">Toutes les équipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div>
          <Label htmlFor="projectId" className="text-green-700">Chantier</Label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger className="border-green-200 bg-white">
                  <SelectValue placeholder="Sélectionner un chantier" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectId && (
            <p className="text-sm text-red-500">{errors.projectId.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <Label className="text-green-700">Date</Label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-green-200 bg-white",
                      !dateValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                    {dateValue ? formatDate(dateValue) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < addDays(new Date(), -365)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="duration" className="text-green-700">Durée prévue (heures)</Label>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input 
                  type="number" 
                  id="duration" 
                  step="0.5"
                  className="w-full flex h-10 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={field.value || 0}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  readOnly 
                />
                <FileSpreadsheet className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
              </div>
            )}
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <Label htmlFor="personnel" className="text-green-700 flex items-center">
          <Users className="w-4 h-4 mr-1 text-green-600" />
          Personnel présent
        </Label>
        <Controller
          name="personnel"
          control={control}
          render={({ field }) => (
            <PersonnelDialog 
              selectedPersonnel={field.value || []} // Add fallback empty array here too
              onChange={handlePersonnelChange}
            />
          )}
        />
        {errors.personnel && (
          <p className="text-sm text-red-500">{errors.personnel.message}</p>
        )}
        {selectedPersonnel.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedPersonnel.map(person => (
              <span 
                key={person}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200"
              >
                {person}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderSection;
