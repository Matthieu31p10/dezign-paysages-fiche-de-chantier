
import React from 'react';
import { Trash2 } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { formatWasteManagement } from '@/utils/format-helpers';

const WasteManagementSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  return (
    <div className="p-3 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Gestion des déchets</h3>
      <div className="flex items-center">
        <Trash2 className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="font-medium">
          {formatWasteManagement(workLog.wasteManagement)}
        </span>
      </div>
    </div>
  );
};

export default WasteManagementSection;
