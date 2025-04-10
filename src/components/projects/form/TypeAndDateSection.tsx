
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TypeAndDateSectionProps {
  projectType: string;
  startDate: Date | null;
  endDate: Date | null;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (name: string, date: Date | undefined) => void;
}

const TypeAndDateSection: React.FC<TypeAndDateSectionProps> = ({
  projectType,
  startDate,
  endDate,
  onSelectChange,
  onDateChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="projectType">Type de chantier</Label>
        <Select
          value={projectType}
          onValueChange={(value) => onSelectChange('projectType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residence">Résidence</SelectItem>
            <SelectItem value="particular">Particulier</SelectItem>
            <SelectItem value="enterprise">Entreprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Date de début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => onDateChange('startDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label>Date de fin</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "PPP")
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => onDateChange('endDate', date)}
              disabled={(date) =>
                date < (startDate || new Date())
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TypeAndDateSection;
