
import WorkLogForm from '@/components/worklogs/WorkLogForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { Card } from '@/components/ui/card';

const WorkLogNew = () => {
  const navigate = useNavigate();
  const { projectInfos } = useApp();
  const { workLogs } = useWorkLogs();
  
  const handleReturn = () => {
    // Naviguer vers la liste des fiches de suivi sans perdre l'historique
    navigate('/worklogs', { replace: false });
  };
  
  const handleSuccess = () => {
    console.log("Form submitted successfully, navigating to /worklogs");
    navigate('/worklogs');
  };
  
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
          <h1 className="text-2xl font-semibold text-green-800">Nouvelle fiche de suivi</h1>
        </div>
      </div>
      
      <Card className="p-6 border-green-200 shadow-md bg-gradient-to-br from-white to-green-50">
        <WorkLogForm 
          onSuccess={handleSuccess}
          projectInfos={projectInfos}
          existingWorkLogs={workLogs}
        />
      </Card>
    </div>
  );
};

export default WorkLogNew;
