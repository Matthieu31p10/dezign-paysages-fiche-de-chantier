
import React, { useState } from 'react';
import { Controller, Control, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
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
import { Progress } from '@/components/ui/progress';

type FormValues = z.infer<typeof formSchema>;

interface TasksSectionProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
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
    
    if (!checked) {
      const currentProgress = watch('customTasksProgress') || {};
      const newProgress = { ...currentProgress };
      delete newProgress[taskId];
      setValue('customTasksProgress', newProgress);
    } else if (!watch('customTasksProgress')?.[taskId]) {
      const currentProgress = watch('customTasksProgress') || {};
      setValue('customTasksProgress', { 
        ...currentProgress, 
        [taskId]: 0
      });
    }
  };
  
  const TaskProgressSelect = ({ 
    taskName, 
    isChecked, 
    progressFieldName 
  }: { 
    taskName: string; 
    isChecked: boolean; 
    progressFieldName: keyof FormValues;
  }) => {
    if (!isChecked) return null;
    
    return (
      <div className="mt-1 ml-6">
        <Controller
          control={control}
          name={progressFieldName as any}
          render={({ field }) => (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Avancement: {field.value}%</span>
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <SelectValue placeholder="%" />
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
              </div>
              <Progress value={field.value} className="h-1 w-full" />
            </>
          )}
        />
      </div>
    );
  };
  
  const CustomTaskProgress = ({ taskId }: { taskId: string }) => {
    const isChecked = watch('customTasks')?.[taskId] || false;
    
    if (!isChecked) return null;
    
    return (
      <div className="mt-1 ml-6">
        <Controller
          control={control}
          name={`customTasksProgress.${taskId}`}
          defaultValue={0}
          render={({ field }) => (
            <>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Avancement: {field.value || 0}%</span>
                <Select
                  value={(field.value || 0).toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <SelectValue placeholder="%" />
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
              </div>
              <Progress value={field.value || 0} className="h-1 w-full" />
            </>
          )}
        />
      </div>
    );
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
        <div className="space-y-2">
          <Label htmlFor="mowing" className="flex items-center space-x-2">
            <Checkbox id="mowing" {...register("mowing")} />
            <span>Tonte</span>
          </Label>
          <TaskProgressSelect 
            taskName="Tonte" 
            isChecked={watch("mowing")} 
            progressFieldName="mowingProgress" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brushcutting" className="flex items-center space-x-2">
            <Checkbox id="brushcutting" {...register("brushcutting")} />
            <span>Débroussaillage</span>
          </Label>
          <TaskProgressSelect 
            taskName="Débroussaillage" 
            isChecked={watch("brushcutting")} 
            progressFieldName="brushcuttingProgress" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="blower" className="flex items-center space-x-2">
            <Checkbox id="blower" {...register("blower")} />
            <span>Soufflage</span>
          </Label>
          <TaskProgressSelect 
            taskName="Soufflage" 
            isChecked={watch("blower")} 
            progressFieldName="blowerProgress" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="manualWeeding" className="flex items-center space-x-2">
            <Checkbox id="manualWeeding" {...register("manualWeeding")} />
            <span>Désherbage manuel</span>
          </Label>
          <TaskProgressSelect 
            taskName="Désherbage manuel" 
            isChecked={watch("manualWeeding")} 
            progressFieldName="manualWeedingProgress" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whiteVinegar" className="flex items-center space-x-2">
            <Checkbox id="whiteVinegar" {...register("whiteVinegar")} />
            <span>Vinaigre blanc</span>
          </Label>
          <TaskProgressSelect 
            taskName="Vinaigre blanc" 
            isChecked={watch("whiteVinegar")} 
            progressFieldName="whiteVinegarProgress" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pruningDone" className="flex items-center space-x-2">
            <Checkbox id="pruningDone" {...register("pruningDone")} />
            <span>Taille</span>
          </Label>
          <TaskProgressSelect 
            taskName="Taille" 
            isChecked={watch("pruningDone")} 
            progressFieldName="pruningProgress" 
          />
        </div>
        
        {/* Custom tasks */}
        {customTasks.map((task: CustomTask) => (
          <div key={task.id} className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Checkbox 
                id={`custom-task-${task.id}`}
                checked={watch('customTasks')?.[task.id] || false}
                onCheckedChange={(checked) => handleCustomTaskChange(task.id, checked === true)}
              />
              <span>{task.name}</span>
            </Label>
            <CustomTaskProgress taskId={task.id} />
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
