
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import WorkLogForm from '@/components/worklogs/WorkLogForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const WorkLogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { workLogs, projectInfos } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the workLog by ID
  const workLog = id ? workLogs.find(log => log.id === id) : undefined;
  
  useEffect(() => {
    console.log("WorkLogEdit - Loading workLog:", id);
    console.log("Available workLogs:", workLogs);
    console.log("Found workLog:", workLog);
    
    // Small delay to ensure data is available
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id, workLog, workLogs]);
  
  const handleReturn = () => {
    // Naviguer vers la fiche de détail au lieu de la liste
    navigate(`/worklogs/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!workLog) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de suivi non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La fiche de suivi que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/worklogs')}>
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
            onClick={handleReturn}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Modifier la fiche de suivi</h1>
        </div>
      </div>
      
      <Card className="p-6">
        <WorkLogForm 
          initialData={workLog} 
          onSuccess={() => {
            toast.success("Fiche de suivi modifiée avec succès");
            handleReturn();
          }} 
          projectInfos={projectInfos}
          existingWorkLogs={workLogs}
        />
      </Card>
    </div>
  );
};

export default WorkLogEdit;
