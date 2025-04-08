
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import CustomTaskDialog from './CustomTaskDialog';
import { useApp } from '@/context/AppContext';
import { CustomTask } from '@/types/models';
import { useWorkLogForm } from './WorkLogFormContext';

const TasksSection: React.FC = () => {
  const { settings } = useApp();
  const { form } = useWorkLogForm();
  const { control, watch, setValue } = form;
  
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
    const currentCustomTasks = watch('customTasks') || {};
    const updatedCustomTasks = { ...currentCustomTasks };
    delete updatedCustomTasks[taskId];
    setValue('customTasks', updatedCustomTasks);
    
    const currentTasksProgress = watch('tasksProgress') || {};
    const updatedTasksProgress = { ...currentTasksProgress };
    delete updatedTasksProgress[taskId];
    setValue('tasksProgress', updatedTasksProgress);
  };

  // Empêcher la propagation de l'événement pour ne pas soumettre le formulaire parent
  const openTaskDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCustomTaskDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Tâches personnalisées</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={openTaskDialog}
          className="flex items-center text-xs"
        >
          <PlusCircle className="h-3.5 w-3.5 mr-1" />
          Ajouter une tâche
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customTasks.map((task: CustomTask) => (
          <div key={task.id} className="space-y-2 border rounded-md p-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Controller
                  name={`customTasks.${task.id}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        handleCustomTaskChange(task.id, e.target.checked);
                      }}
                      className="form-checkbox"
                    />
                  )}
                />
                <span>{task.name}</span>
              </Label>
              
              {watch(`customTasks.${task.id}`) && (
                <div className="flex items-center gap-1">
                  <Controller
                    control={control}
                    name={`tasksProgress.${task.id}`}
                    defaultValue={0}
                    render={({ field }) => (
                      <div className="flex items-center gap-2 w-28">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={field.value || 0}
                          onChange={(e) => {
                            const progress = Number(e.target.value);
                            field.onChange(progress);
                            handleTaskProgressChange(task.id, progress);
                          }}
                          className="w-full"
                        />
                        <span className="text-xs font-medium w-9 text-right">{field.value || 0}%</span>
                      </div>
                    )}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Label htmlFor="watering">Arrosage</Label>
        <Controller
          name="watering"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
