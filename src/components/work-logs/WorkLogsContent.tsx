
import { ProjectInfo, WorkLog } from '@/types/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WorkLogList from '@/components/worklogs/WorkLogList';
import WorkLogsEmptyState from './WorkLogsEmptyState';
import WorkLogsNoResults from './WorkLogsNoResults';
import { useNavigate } from 'react-router-dom';

interface WorkLogsContentProps {
  workLogs: WorkLog[];
  filteredLogs: WorkLog[];
  projectInfos: ProjectInfo[];
  selectedProjectId: string | 'all';
  selectedMonth: number | 'all';
  selectedYear: number;
}

const WorkLogsContent = ({
  workLogs,
  filteredLogs,
  projectInfos,
  selectedProjectId,
  selectedMonth,
  selectedYear,
}: WorkLogsContentProps) => {
  const navigate = useNavigate();
  
  if (workLogs.length === 0) {
    return (
      <Card>
        <CardContent>
          <WorkLogsEmptyState hasProjects={projectInfos.length > 0} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Fiches de suivi</CardTitle>
        <CardDescription>
          {selectedProjectId === 'all'
            ? 'Toutes les fiches de suivi'
            : `Fiches de suivi pour ${projectInfos.find(p => p.id === selectedProjectId)?.name || 'ce chantier'}`
          }
          {selectedMonth !== 'all' && typeof selectedMonth === 'number' && 
            ` - ${new Date(0, selectedMonth - 1).toLocaleString('fr-FR', { month: 'long' })}`}
          {` - ${selectedYear}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <WorkLogsNoResults />
        ) : (
          <WorkLogList workLogs={filteredLogs} />
        )}
      </CardContent>
    </Card>
  );
};

export default WorkLogsContent;
