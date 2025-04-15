
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkLog } from '@/types/models';
import { formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileBarChart, Clock, User, FileText } from 'lucide-react';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { extractRegistrationTime } from '@/utils/date-helpers';

interface BlankSheetItemProps {
  worklog: WorkLog;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({ worklog }) => {
  const navigate = useNavigate();
  const { updateWorkLog } = useWorkLogs();
  
  const handleClick = () => {
    navigate(`/worklogs/${worklog.id}`);
  };
  
  const handleInvoiceToggle = (checked: boolean) => {
    updateWorkLog(worklog.id, { invoiced: checked });
  };
  
  // Format the creation time from the notes or createdAt date
  const registrationTime = worklog.createdAt 
    ? (typeof worklog.createdAt === 'string' 
      ? worklog.createdAt 
      : worklog.createdAt.toISOString()) 
    : extractRegistrationTime(worklog.notes || '');
  
  // Calculate duration hours
  const totalHours = worklog.timeTracking?.totalHours || 0;
  const personnelCount = worklog.personnel?.length || 1;
  
  return (
    <div
      className="border rounded-lg p-4 bg-white hover:shadow transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700 font-mono">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              {worklog.projectId}
            </Badge>
            {registrationTime && (
              <span className="text-xs text-muted-foreground">
                Enregistré le {formatDate(registrationTime)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-brand-50 text-brand-700">
              {formatDate(worklog.date)}
            </Badge>
            {worklog.clientName && (
              <span className="font-medium">
                {worklog.clientName}
              </span>
            )}
          </div>
          
          {worklog.address && (
            <p className="text-sm text-muted-foreground mt-1">
              {worklog.address}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center text-sm">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              {totalHours.toFixed(2)} heures
            </div>
            
            <div className="flex items-center text-sm">
              <User className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              {personnelCount} personnes
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-2 sm:mt-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`invoiced-${worklog.id}`}
              checked={worklog.invoiced || false}
              onCheckedChange={handleInvoiceToggle}
              className="h-4 w-4 data-[state=checked]:bg-green-600"
            />
            <Label 
              htmlFor={`invoiced-${worklog.id}`}
              className="text-xs cursor-pointer select-none"
            >
              Facturée
            </Label>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/worklogs/${worklog.id}/edit`);
            }}
          >
            Modifier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlankSheetItem;
