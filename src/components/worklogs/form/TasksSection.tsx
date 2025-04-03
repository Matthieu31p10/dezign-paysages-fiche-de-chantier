
import React, { useState } from 'react';
import { Controller, Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { formSchema } from './schema';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CustomTaskDialog from './CustomTaskDialog';
import { useApp } from '@/context/AppContext';
import { CustomTask } from '@/types/models';

type FormValues = z.infer<typeof formSchema>;

interface TasksSectionProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  watch: (name: string) => any;
  setValue: UseFormSetValue<FormValues>;
}

const TasksSection: React.FC<TasksSectionProps> = ({ 
  control, 
  register, 
  watch,
  setValue
}) => {
  const { settings } = useApp();
  const [customTaskDialogOpen, setCustomTaskDialogOpen] = useState(false);
  const customTasks = settings.customTasks || [];
  
  const handleCustomTaskChange = (taskId: string, checked: boolean) => {
    const currentCustomTasks = watch('customTasks') || {};
    setValue('customTasks', { 
      ...currentCustomTasks, 
      [taskId]: checked 
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Travaux effectués</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setCustomTaskDialogOpen(true)}
          className="flex items-center text-xs"
        >
          <PlusCircle className="h-3.5 w-3.5 mr-1" />
          Ajouter une tâche
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mowing" className="flex items-center space-x-2">
            <Checkbox id="mowing" {...register("mowing")} />
            <span>Tonte</span>
          </Label>
        </div>
        
        <div>
          <Label htmlFor="brushcutting" className="flex items-center space-x-2">
            <Checkbox id="brushcutting" {...register("brushcutting")} />
            <span>Débroussaillage</span>
          </Label>
        </div>
        
        <div>
          <Label htmlFor="blower" className="flex items-center space-x-2">
            <Checkbox id="blower" {...register("blower")} />
            <span>Soufflage</span>
          </Label>
        </div>
        
        <div>
          <Label htmlFor="manualWeeding" className="flex items-center space-x-2">
            <Checkbox id="manualWeeding" {...register("manualWeeding")} />
            <span>Désherbage manuel</span>
          </Label>
        </div>
        
        <div>
          <Label htmlFor="whiteVinegar" className="flex items-center space-x-2">
            <Checkbox id="whiteVinegar" {...register("whiteVinegar")} />
            <span>Vinaigre blanc</span>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <div className="flex items-center space-x-2 mt-0.5">
            <Checkbox id="pruningDone" {...register("pruningDone")} />
            <Label htmlFor="pruningDone" className="font-normal">Taille</Label>
          </div>
          
          {watch("pruningDone") && (
            <div className="flex-1">
              <Controller
                control={control}
                name="pruningProgress"
                render={({ field }) => (
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-full h-8">
                      <SelectValue placeholder="Progression" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                      <SelectItem value="30">30%</SelectItem>
                      <SelectItem value="40">40%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="60">60%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>
        
        {/* Custom tasks */}
        {customTasks.map((task: CustomTask) => (
          <div key={task.id}>
            <Label className="flex items-center space-x-2">
              <Checkbox 
                id={`custom-task-${task.id}`}
                checked={watch('customTasks')?.[task.id] || false}
                onCheckedChange={(checked) => handleCustomTaskChange(task.id, checked === true)}
              />
              <span>{task.name}</span>
            </Label>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Label htmlFor="watering">Arrosage</Label>
        <Controller
          name="watering"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Pas d'arrosage</SelectItem>
                <SelectItem value="on">Allumé</SelectItem>
                <SelectItem value="off">Coupé</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      
      <CustomTaskDialog 
        open={customTaskDialogOpen} 
        onOpenChange={setCustomTaskDialogOpen} 
      />
    </div>
  );
};

export default TasksSection;
