
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import WorkTaskForm from '@/components/worktasks/WorkTaskForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WorkTaskEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workTasks } = useApp();
  
  const workTask = workTasks.find(task => task.id === id);
  
  const handleSuccess = () => {
    toast.success('Fiche de travaux modifiée avec succès');
    navigate(`/worktasks/${id}`);
  };
  
  if (!workTask) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Fiche de travaux introuvable</h2>
        <p className="text-muted-foreground mb-6">
          La fiche de travaux que vous essayez de modifier n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/worktasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux fiches de travaux
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2"
          onClick={() => navigate(`/worktasks/${id}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la fiche
        </Button>
        <h1 className="text-2xl font-semibold">Modifier la fiche de travaux</h1>
        <p className="text-muted-foreground">
          {workTask.title} - {workTask.location}
        </p>
      </div>
      
      <WorkTaskForm initialData={workTask} onSuccess={handleSuccess} />
    </div>
  );
};

export default WorkTaskEdit;
