
import WorkLogForm from '@/components/worklogs/WorkLogForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const WorkLogNew = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2"
            onClick={() => navigate('/worklogs')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Nouvelle fiche de suivi</h1>
        </div>
      </div>
      
      <WorkLogForm onSuccess={() => navigate('/worklogs')} />
    </div>
  );
};

export default WorkLogNew;
