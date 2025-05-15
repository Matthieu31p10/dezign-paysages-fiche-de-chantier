
import React from 'react';
import { Droplets } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WaterConsumptionSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  if (workLog.waterConsumption === undefined || workLog.waterConsumption === null) {
    return null;
  }
  
  return (
    <div className="p-3 border rounded-md bg-gray-50 hover:bg-blue-50 transition-colors">
      <h3 className="text-sm font-medium mb-2">Consommation d'eau</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-default">
              <Droplets className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">{workLog.waterConsumption} m³</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Volume d'eau utilisé pendant l'intervention</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WaterConsumptionSection;
