
import React from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { formSchema } from './schema';
import { Droplet } from 'lucide-react';

type FormValues = z.infer<typeof formSchema>;

interface ProjectExtraFieldsProps {
  project: ProjectInfo;
  register: UseFormRegister<FormValues>;
  errors: Record<string, any>;
  previousWaterConsumption?: number | null;
}

const ProjectExtraFields: React.FC<ProjectExtraFieldsProps> = ({ 
  project, 
  register, 
  errors,
  previousWaterConsumption
}) => {
  if (!project || project.irrigation === 'none') return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <div>
        <Label htmlFor="waterConsumption" className="flex items-center">
          <Droplet className="h-4 w-4 mr-2 text-blue-500" />
          Consommation d'eau (m³)
        </Label>
        <Input type="number" id="waterConsumption" step="0.1"
          {...register("waterConsumption", {
            valueAsNumber: true,
          })}
        />
        {errors.waterConsumption && (
          <p className="text-sm text-red-500">{errors.waterConsumption.message}</p>
        )}
        {previousWaterConsumption !== undefined && previousWaterConsumption !== null && (
          <p className="text-sm text-muted-foreground mt-1">
            Dernier relevé: {previousWaterConsumption} m³
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectExtraFields;
