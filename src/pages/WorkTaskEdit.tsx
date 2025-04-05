
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import WorkTaskForm from '@/components/worktasks/WorkTaskForm';
import { toast } from 'sonner';

const WorkTaskEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getWorkTaskById } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the workTask by ID
  const workTask = id ? getWorkTaskById(id) : undefined;
  
  useEffect(() => {
    console.log("WorkTaskEdit - Loading workTask:", id);
    
    // Small delay to ensure data is available
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id, workTask]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!workTask) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de travaux non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La fiche de travaux que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/worktasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2"
            onClick={() => navigate(`/worktasks/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Modifier la fiche de travaux</h1>
        </div>
      </div>
      
      <Card className="p-6">
        <WorkTaskForm 
          initialData={workTask} 
          onSuccess={() => {
            toast.success("Fiche de travaux modifiée avec succès");
            navigate(`/worktasks/${id}`);
          }} 
        />
      </Card>
    </div>
  );
};

export default WorkTaskEdit;
