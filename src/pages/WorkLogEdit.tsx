
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import WorkLogForm from '@/components/worklogs/WorkLogForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const WorkLogEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projectInfos } = useApp();
  const { workLogs, getWorkLogById } = useWorkLogs();
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the workLog by ID
  const workLog = id ? getWorkLogById(id) : undefined;
  
  useEffect(() => {
    console.log("WorkLogEdit - Loading workLog:", id);
    
    // Small delay to ensure data is available
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id, workLog]);
  
  const handleReturn = () => {
    // Naviguer vers la fiche de détail sans perdre l'historique
    navigate(`/worklogs/${id}`, { replace: false });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!workLog) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4 text-green-800">Fiche de suivi non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La fiche de suivi que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/worklogs')} className="bg-green-600 hover:bg-green-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  const isBlankWorksheet = workLog.isBlankWorksheet || false;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2 text-green-700 hover:text-green-800 hover:bg-green-100"
            onClick={handleReturn}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold text-green-800">
            Modifier la fiche {isBlankWorksheet ? 'vierge' : 'de suivi'}
          </h1>
        </div>
      </div>
      
      <Card className="p-6 border-green-200 shadow-md">
        <WorkLogForm 
          initialData={workLog} 
          onSuccess={() => {
            toast.success(`Fiche ${isBlankWorksheet ? 'vierge' : 'de suivi'} modifiée avec succès`);
            handleReturn();
          }} 
          projectInfos={projectInfos}
          existingWorkLogs={workLogs}
          isBlankWorksheet={isBlankWorksheet}
        />
      </Card>
    </div>
  );
};

export default WorkLogEdit;
