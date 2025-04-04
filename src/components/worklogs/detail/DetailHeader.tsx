
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/helpers';
import HeaderActions from './HeaderActions';
import { useWorkLogDetail } from './WorkLogDetailContext';

const DetailHeader: React.FC = () => {
  const navigate = useNavigate();
  const { workLog, project } = useWorkLogDetail();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => navigate('/worklogs')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <Badge variant="outline" className="bg-brand-50 text-brand-700">
            {formatDate(workLog.date)}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold mt-2">
          {project?.name || 'Chantier inconnu'}
        </h1>
        <p className="text-muted-foreground">
          Fiche de suivi du {formatDate(workLog.date)}
        </p>
      </div>
      
      <HeaderActions workLogId={workLog.id} />
    </div>
  );
};

export default DetailHeader;
