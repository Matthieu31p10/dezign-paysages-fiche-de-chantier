
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import WorkTaskForm from '@/components/worktasks/WorkTaskForm';
import { toast } from 'sonner';

const WorkTaskNew = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2"
            onClick={() => navigate('/worktasks')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Nouvelle fiche de travaux</h1>
        </div>
      </div>
      
      <Card className="p-6">
        <WorkTaskForm 
          onSuccess={() => {
            toast.success("Fiche de travaux créée avec succès");
            navigate('/worktasks');
          }} 
        />
      </Card>
    </div>
  );
};

export default WorkTaskNew;
