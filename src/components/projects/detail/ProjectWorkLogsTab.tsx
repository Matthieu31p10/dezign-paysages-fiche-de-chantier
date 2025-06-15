
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import WorkLogList from '../../worklogs/WorkLogList';
import { ProjectInfo, WorkLog } from '@/types/models';

interface ProjectWorkLogsTabProps {
  project: ProjectInfo;
  workLogs: WorkLog[];
  isMobile?: boolean;
}

const ProjectWorkLogsTab: React.FC<ProjectWorkLogsTabProps> = ({ project, workLogs, isMobile = false }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row md:items-center'} justify-between gap-2`}>
          <CardTitle className="text-lg">Fiches de suivi</CardTitle>
          <Button 
            size="sm" 
            className={isMobile ? "w-full" : ""}
            onClick={() => navigate(`/worklogs/new?projectId=${project.id}`)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Nouvelle fiche
          </Button>
        </div>
        <CardDescription>
          Fiches de suivi pour ce chantier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkLogList workLogs={workLogs} />
      </CardContent>
    </Card>
  );
};

export default ProjectWorkLogsTab;
