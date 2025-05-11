
import React from 'react';
import { Droplets } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const WaterConsumptionSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  if (workLog.waterConsumption === undefined) {
    return null;
  }
  
  return (
    <div className="p-3 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Consommation d'eau</h3>
      <div className="flex items-center">
        <Droplets className="w-4 h-4 mr-2 text-blue-500" />
        <span className="font-medium">{workLog.waterConsumption} m³</span>
      </div>
    </div>
  );
};

export default WaterConsumptionSection;
