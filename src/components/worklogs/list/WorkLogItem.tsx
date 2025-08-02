
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
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header unifié */}
            <div className="flex items-center gap-2 mb-1.5">
              {isBlankWorksheet ? (
                <FileBarChart className="h-4 w-4 text-primary" />
              ) : (
                <FileText className="h-4 w-4 text-primary" />
              )}
              <h3 className="font-medium">
                {isBlankWorksheet ? (
                  workLog.clientName || 'Fiche vierge sans nom'
                ) : (
                  project?.name || 'Chantier inconnu'
                )}
              </h3>
              
              {/* Badge du type de fiche */}
              {isBlankWorksheet ? (
                workLog.projectId && workLog.projectId.startsWith('DZFV') && (
                  <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {workLog.projectId}
                  </Badge>
                )
              ) : (
                <Badge variant="outline" className="ml-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Fiche de suivi
                </Badge>
              )}
              
              {/* Badges à droite */}
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(new Date(workLog.date))}
                </Badge>
                
                {workLog.createdAt && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {new Date(workLog.createdAt).toLocaleTimeString('fr-FR', { 
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Badge>
                )}
              </div>
            </div>

            {/* Team badge et statuts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {team && <TeamBadge teamName={team.name} teamColor={team.color} />}
              </div>
              <div className="flex items-center gap-2">
                {workLog.isQuoteSigned && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Devis signé
                  </Badge>
                )}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">Heures équipe</p>
                  <p className="font-medium">{totalTeamHours.toFixed(2)}h</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Personnel</p>
                  <p className="font-medium">{personnelCount} personne{personnelCount > 1 ? 's' : ''}</p>
                </div>
                
              </div>
              
              {/* Adresse */}
              {(workLog.address || project?.address) && (
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {workLog.address || project?.address}
                </p>
              )}
            </div>


            {/* Notes preview */}
            {workLog.notes && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
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
