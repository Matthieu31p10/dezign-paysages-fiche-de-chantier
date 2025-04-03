
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { formSchema } from './schema';

type FormValues = z.infer<typeof formSchema>;

// Helper functions
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

const generateBreakOptions = () => {
  const breaks = [];
  for (let i = 0; i <= 3; i += 0.25) {
    breaks.push(i.toFixed(2));
  }
  return breaks;
};

interface TimeTrackingSectionProps {
  control: Control<FormValues>;
  errors: Record<string, any>;
  watch: (name: string) => any;
  getValues: (name?: string | string[]) => any;
}

const TimeTrackingSection: React.FC<TimeTrackingSectionProps> = ({ 
  control, 
  errors, 
  watch,
  getValues 
}) => {
  const timeOptions = generateTimeOptions();
  const breakOptions = generateBreakOptions();
  
  return (
    <div>
      <Label>Heures de travail</Label>
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Heures de départ</TableHead>
            <TableHead>Heures d'arrivée</TableHead>
            <TableHead>Fin du chantier</TableHead>
            <TableHead>Pause (heures)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Controller
                name="departure"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Heure de départ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`departure-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departure && (
                <p className="text-xs text-red-500">{errors.departure.message}</p>
              )}
            </TableCell>
            <TableCell>
              <Controller
                name="arrival"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Heure d'arrivée" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`arrival-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.arrival && (
                <p className="text-xs text-red-500">{errors.arrival.message}</p>
              )}
            </TableCell>
            <TableCell>
              <Controller
                name="end"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Fin du chantier" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.end && (
                <p className="text-xs text-red-500">{errors.end.message}</p>
              )}
            </TableCell>
            <TableCell>
              <Controller
                name="breakTime"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pause" />
                    </SelectTrigger>
                    <SelectContent>
                      {breakOptions.map((breakTime) => (
                        <SelectItem key={`break-${breakTime}`} value={breakTime}>
                          {breakTime} h
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.breakTime && (
                <p className="text-xs text-red-500">{errors.breakTime.message}</p>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-4 p-3 border rounded-md bg-blue-50">
        <div className="flex justify-between items-center">
          <Label htmlFor="totalHours" className="font-medium">Total des heures (équipe)</Label>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xl font-bold">
              {getValues("totalHours").toFixed(2)} h
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          (Fin du chantier - Heures de départ - Pause) × Nombre de personnel
        </p>
      </div>
    </div>
  );
};

export default TimeTrackingSection;
