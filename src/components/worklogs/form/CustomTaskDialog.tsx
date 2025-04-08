
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';

interface CustomTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded?: () => void;
}

const CustomTaskDialog: React.FC<CustomTaskDialogProps> = ({ 
  open, 
  onOpenChange,
  onTaskAdded
}) => {
  const { addCustomTask } = useApp();
  const [taskName, setTaskName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    // Empêcher la soumission du formulaire parent
    e.preventDefault();
    e.stopPropagation();
    
    if (!taskName.trim()) {
      toast.error("Veuillez entrer un nom de tâche");
      return;
    }
    
    addCustomTask(taskName.trim());
    toast.success("Tâche ajoutée avec succès");
    setTaskName('');
    onOpenChange(false);
    
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Nom de la tâche</Label>
              <Input
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Ex: Nettoyage haies"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTaskDialog;
