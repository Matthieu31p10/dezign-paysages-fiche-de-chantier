
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin, Eye, Edit, FileText } from 'lucide-react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { formatDate } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

interface WorkLogItemProps {
  workLog: WorkLog;
  project?: ProjectInfo;
  onEdit?: (id: string) => void;
  onExportPDF?: (id: string) => void;
}

const WorkLogItem: React.FC<WorkLogItemProps> = ({
  workLog,
  project,
  onEdit,
  onExportPDF
}) => {
  const navigate = useNavigate();
  
  const handleView = () => {
    navigate(`/worklogs/${workLog.id}`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && workLog.id) {
      onEdit(workLog.id);
    }
  };
  
  const handleExportPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExportPDF && workLog.id) {
      onExportPDF(workLog.id);
    }
  };
  
  const totalTeamHours = (workLog.timeTracking?.totalHours || 0) * (workLog.personnel?.length || 1);
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleView}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">{formatDate(workLog.date)}</span>
                {workLog.isBlankWorksheet && (
                  <Badge variant="outline" className="text-xs bg-blue-50">Fiche vierge</Badge>
                )}
              </div>
              {project && (
                <Badge variant="secondary" className="text-xs">{project.name}</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{workLog.personnel?.length || 0} personne(s)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{totalTeamHours.toFixed(1)}h équipe</span>
              </div>
            </div>
            
            {workLog.notes && (
              <p className="text-xs text-gray-500 truncate">{workLog.notes}</p>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleView}>
              <Eye className="h-3 w-3" />
            </Button>
            {onEdit && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleEdit}>
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onExportPDF && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleExportPDF}>
                <FileText className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkLogItem;
