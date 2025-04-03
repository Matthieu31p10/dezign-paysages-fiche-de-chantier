
import React, { useState } from 'react';
import { Controller, Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { formSchema } from './schema';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash, X } from 'lucide-react';
import CustomTaskDialog from './CustomTaskDialog';
import { useApp } from '@/context/AppContext';
import { CustomTask } from '@/types/models';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  
  const handleTaskProgressChange = (taskId: string, progress: number) => {
    const currentTasksProgress = watch('tasksProgress') || {};
    setValue('tasksProgress', { 
      ...currentTasksProgress, 
      [taskId]: progress 
    });
  };
  
  const handleDeleteTask = (taskId: string) => {
    // Supprimer la tâche des tâches personnalisées
    const currentCustomTasks = watch('customTasks') || {};
    const updatedCustomTasks = { ...currentCustomTasks };
    delete updatedCustomTasks[taskId];
    setValue('customTasks', updatedCustomTasks);
    
    // Supprimer également la progression associée
    const currentTasksProgress = watch('tasksProgress') || {};
    const updatedTasksProgress = { ...currentTasksProgress };
    delete updatedTasksProgress[taskId];
    setValue('tasksProgress', updatedTasksProgress);
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
        <div className="space-y-2 border rounded-md p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="mowing" className="flex items-center space-x-2">
              <Checkbox id="mowing" {...register("mowing")} />
              <span>Tonte</span>
            </Label>
            {watch("mowing") && (
              <Controller
                control={control}
                name="tasksProgress.mowing"
                defaultValue={0}
                render={({ field }) => (
                  <div className="flex items-center gap-2 w-28">
                    <Slider
                      value={[field.value || 0]}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                  </div>
                )}
              />
            )}
          </div>
          {watch("mowing") && (
            <Progress value={watch("tasksProgress.mowing") || 0} className="h-1.5" />
          )}
        </div>
        
        <div className="space-y-2 border rounded-md p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="brushcutting" className="flex items-center space-x-2">
              <Checkbox id="brushcutting" {...register("brushcutting")} />
              <span>Débroussaillage</span>
            </Label>
            {watch("brushcutting") && (
              <Controller
                control={control}
                name="tasksProgress.brushcutting"
                defaultValue={0}
                render={({ field }) => (
                  <div className="flex items-center gap-2 w-28">
                    <Slider
                      value={[field.value || 0]}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                  </div>
                )}
              />
            )}
          </div>
          {watch("brushcutting") && (
            <Progress value={watch("tasksProgress.brushcutting") || 0} className="h-1.5" />
          )}
        </div>
        
        <div className="space-y-2 border rounded-md p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="blower" className="flex items-center space-x-2">
              <Checkbox id="blower" {...register("blower")} />
              <span>Soufflage</span>
            </Label>
            {watch("blower") && (
              <Controller
                control={control}
                name="tasksProgress.blower"
                defaultValue={0}
                render={({ field }) => (
                  <div className="flex items-center gap-2 w-28">
                    <Slider
                      value={[field.value || 0]}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                  </div>
                )}
              />
            )}
          </div>
          {watch("blower") && (
            <Progress value={watch("tasksProgress.blower") || 0} className="h-1.5" />
          )}
        </div>
        
        <div className="space-y-2 border rounded-md p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="manualWeeding" className="flex items-center space-x-2">
              <Checkbox id="manualWeeding" {...register("manualWeeding")} />
              <span>Désherbage manuel</span>
            </Label>
            {watch("manualWeeding") && (
              <Controller
                control={control}
                name="tasksProgress.manualWeeding"
                defaultValue={0}
                render={({ field }) => (
                  <div className="flex items-center gap-2 w-28">
                    <Slider
                      value={[field.value || 0]}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                  </div>
                )}
              />
            )}
          </div>
          {watch("manualWeeding") && (
            <Progress value={watch("tasksProgress.manualWeeding") || 0} className="h-1.5" />
          )}
        </div>
        
        <div className="space-y-2 border rounded-md p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="whiteVinegar" className="flex items-center space-x-2">
              <Checkbox id="whiteVinegar" {...register("whiteVinegar")} />
              <span>Vinaigre blanc</span>
            </Label>
            {watch("whiteVinegar") && (
              <Controller
                control={control}
                name="tasksProgress.whiteVinegar"
                defaultValue={0}
                render={({ field }) => (
                  <div className="flex items-center gap-2 w-28">
                    <Slider
                      value={[field.value || 0]}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                  </div>
                )}
              />
            )}
          </div>
          {watch("whiteVinegar") && (
            <Progress value={watch("tasksProgress.whiteVinegar") || 0} className="h-1.5" />
          )}
        </div>
        
        <div className="space-y-2 border rounded-md p-3">
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
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 w-full">
                        <Slider
                          value={[field.value]}
                          min={0}
                          max={100}
                          step={10}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                        <span className="text-xs font-medium w-9 text-right">{field.value}%</span>
                      </div>
                      <Progress value={field.value} className="h-1.5" />
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Custom tasks */}
        {customTasks.map((task: CustomTask) => (
          <div key={task.id} className="space-y-2 border rounded-md p-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Checkbox 
                  id={`custom-task-${task.id}`}
                  checked={watch('customTasks')?.[task.id] || false}
                  onCheckedChange={(checked) => handleCustomTaskChange(task.id, checked === true)}
                />
                <span>{task.name}</span>
              </Label>
              {watch('customTasks')?.[task.id] && (
                <div className="flex items-center gap-1">
                  <Controller
                    control={control}
                    name={`tasksProgress.${task.id}`}
                    defaultValue={0}
                    render={({ field }) => (
                      <div className="flex items-center gap-2 w-28">
                        <Slider
                          value={[field.value || 0]}
                          min={0}
                          max={100}
                          step={10}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                        <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                      </div>
                    )}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Trash className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action supprimera la tâche de la fiche de suivi actuelle.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            {watch('customTasks')?.[task.id] && (
              <Progress value={watch(`tasksProgress.${task.id}`) || 0} className="h-1.5" />
            )}
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
