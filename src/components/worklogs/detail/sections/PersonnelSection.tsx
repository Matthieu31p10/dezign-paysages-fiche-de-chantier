
import React from 'react';
import { User } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PersonnelSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  if (!workLog.personnel || workLog.personnel.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">Personnel présent</h3>
        <p className="text-sm text-muted-foreground">Aucun personnel renseigné</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">Personnel présent</h3>
      <div className="space-y-1">
        {workLog.personnel.map((person, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="flex items-center text-sm hover:bg-gray-50 p-1 rounded cursor-default">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  {person}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Membre de l'équipe {workLog.personnel.length > 1 ? `(${index + 1}/${workLog.personnel.length})` : ''}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default PersonnelSection;
