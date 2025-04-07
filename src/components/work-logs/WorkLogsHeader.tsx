
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface WorkLogsHeaderProps {
  hasProjects: boolean;
}

const WorkLogsHeader = ({ hasProjects }: WorkLogsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Suivi des travaux</h1>
        <p className="text-muted-foreground">
          Gérez vos fiches de suivi de chantier
        </p>
      </div>
      
      <Button 
        onClick={() => navigate('/worklogs/new')}
        disabled={!hasProjects}
      >
        <Plus className="w-4 h-4 mr-2" />
        Nouvelle fiche
      </Button>
    </div>
  );
};

export default WorkLogsHeader;
