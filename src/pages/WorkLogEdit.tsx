
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import WorkLogForm from '@/components/worklogs/WorkLogForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWorkLogs } from '@/context/WorkLogsContext';

const WorkLogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { workLogs } = useWorkLogs();
  const { projectInfos } = useApp();
  
  const workLog = workLogs.find(log => log.id === id);
  
  if (!workLog) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de suivi non trouvée</h2>
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
            onClick={() => navigate(`/worklogs/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Modifier la fiche de suivi</h1>
        </div>
      </div>
      
      <WorkLogForm 
        initialData={workLog} 
        onSuccess={() => navigate(`/worklogs/${id}`)} 
        projectInfos={projectInfos}
        existingWorkLogs={workLogs}
      />
    </div>
  );
};

export default WorkLogEdit;
