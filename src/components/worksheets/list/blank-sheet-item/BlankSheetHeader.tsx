
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { FileBarChart, Tag, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { WorkLog } from '@/types/models';

interface BlankSheetHeaderProps {
  clientName?: string;
  projectId?: string;
  date: string | Date;
  registrationTime: string | Date | null;
  invoiced?: boolean;
  sheet?: WorkLog;
}

const BlankSheetHeader: React.FC<BlankSheetHeaderProps> = ({
  clientName,
  projectId,
  date,
  registrationTime,
  invoiced,
  sheet
}) => {
  // Si une fiche est fournie, utiliser ses propriétés
  const displayClientName = sheet?.clientName || clientName || "Client non spécifié";
  const displayProjectId = sheet?.projectId || projectId;
  const displayDate = sheet?.date || date;
  const displayRegistrationTime = sheet?.createdAt || registrationTime;
  const displayInvoiced = sheet?.invoiced || invoiced;

  return (
    <div className="flex items-center gap-2 mb-1.5">
      <FileBarChart className="h-4 w-4 text-primary" />
      <h3 className="font-medium">{displayClientName}</h3>
      
      {displayProjectId && displayProjectId.startsWith('DZFV') && (
        <Badge variant="secondary" className="ml-2 flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {displayProjectId}
        </Badge>
      )}
      
      <Badge variant="outline" className="ml-auto md:ml-0 flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {formatDate(displayDate)}
      </Badge>
      
      {displayRegistrationTime && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          {new Date(typeof displayRegistrationTime === 'string' ? displayRegistrationTime : displayRegistrationTime.toString()).toLocaleTimeString('fr-FR', { 
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Badge>
      )}
      
      {displayInvoiced && (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Facturée
        </Badge>
      )}
    </div>
  );
};

export default BlankSheetHeader;
