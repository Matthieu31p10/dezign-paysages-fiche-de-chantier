
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TeamBadge from '@/components/ui/team-badge';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/format-utils';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Eye,
  FileText,
  FileBarChart,
  Tag,
  CheckCircle
} from 'lucide-react';

interface WorkLogItemProps {
  workLog: WorkLog;
  project?: ProjectInfo;
}

const WorkLogItem: React.FC<WorkLogItemProps> = ({ workLog, project }) => {
  const navigate = useNavigate();
  const { teams } = useApp();
  
  const team = teams.find(t => t.id === project?.team);
  const isBlankWorksheet = workLog.isBlankWorksheet || !project;
  const totalHours = workLog.timeTracking?.totalHours || workLog.duration || 0;
  const personnelCount = workLog.personnel?.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  
  const handleView = () => {
    navigate(`/worklogs/${workLog.id}`);
  };


  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4" 
          style={{ borderLeftColor: team?.color || (isBlankWorksheet ? '#6B7280' : '#10B981') }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium">
                {project?.name || 'Chantier inconnu'}
              </h3>
              <Badge variant="outline" className="text-xs">
                {formatDate(new Date(workLog.date))}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {totalTeamHours.toFixed(1)}h
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleView}
              className="hover:bg-green-50 hover:border-green-300"
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkLogItem;
