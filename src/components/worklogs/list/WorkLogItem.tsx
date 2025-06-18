
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TeamBadge from '@/components/ui/team-badge';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/date';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Eye,
  FileText,
  Banknote
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
  
  const handleView = () => {
    navigate(`/worklogs/${workLog.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4" 
          style={{ borderLeftColor: team?.color || '#10B981' }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header with project name and badges */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {isBlankWorksheet ? (
                    workLog.clientName || 'Fiche vierge sans nom'
                  ) : (
                    project?.name || 'Chantier inconnu'
                  )}
                </h3>
                {isBlankWorksheet && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Fiche vierge
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {team && <TeamBadge teamName={team.name} teamColor={team.color} />}
                {workLog.invoiced && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Banknote className="h-3 w-3 mr-1" />
                    Facturé
                  </Badge>
                )}
              </div>
            </div>

            {/* Project info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(new Date(workLog.date))}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{workLog.timeTracking?.totalHours || workLog.duration || 0}h</span>
              </div>
              
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{workLog.personnel.length} personne{workLog.personnel.length > 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">
                  {workLog.address || project?.address || 'Adresse non renseignée'}
                </span>
              </div>
            </div>

            {/* Notes preview */}
            {workLog.notes && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {workLog.notes}
              </p>
            )}
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
