
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import WorkTaskForm from '@/components/worktasks/WorkTaskForm';

const WorkTaskNew = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    toast.success('Fiche de travaux créée avec succès');
    navigate('/worktasks');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Nouvelle fiche de travaux</h1>
        <p className="text-muted-foreground">
          Créez une nouvelle fiche pour des travaux ponctuels hors contrat
        </p>
      </div>
      
      <WorkTaskForm onSuccess={handleSuccess} />
    </div>
  );
};

export default WorkTaskNew;
