
import React from 'react';
import { ProjectInfo } from '@/types/models';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { formSchema } from './schema';

type FormValues = z.infer<typeof formSchema>;

interface ProjectExtraFieldsProps {
  project: ProjectInfo;
  register: UseFormRegister<FormValues>;
  errors: Record<string, any>;
}

const ProjectExtraFields: React.FC<ProjectExtraFieldsProps> = ({ 
  project, 
  register, 
  errors 
}) => {
  if (!project || project.irrigation === 'none') return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <div>
        <Label htmlFor="waterConsumption">Consommation d'eau (m³)</Label>
        <Input type="number" id="waterConsumption" step="0.1"
          {...register("waterConsumption", {
            valueAsNumber: true,
          })}
        />
        {errors.waterConsumption && (
          <p className="text-sm text-red-500">{errors.waterConsumption.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectExtraFields;
