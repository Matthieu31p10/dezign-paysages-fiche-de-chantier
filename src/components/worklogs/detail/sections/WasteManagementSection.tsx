
import React from 'react';
import { Trash2, Recycle } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';
import { formatWasteManagement } from '@/utils/format-helpers';

const WasteManagementSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  // If no waste management is defined, still show the section but with "None" indicator
  const wasteManagement = workLog.wasteManagement || 'none';
  
  return (
    <div className="p-4 border rounded-md bg-gradient-to-r from-gray-50 to-green-50 shadow-sm">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Recycle className="w-4 h-4 text-green-600" />
        <span>Gestion des déchets</span>
      </h3>
      <div className="flex items-center bg-white p-3 rounded-md">
        <Trash2 className="w-5 h-5 mr-3 text-muted-foreground" />
        <span className={`font-medium ${wasteManagement === 'none' ? 'text-gray-500' : 'text-green-700'}`}>
          {formatWasteManagement(workLog.wasteManagement)}
        </span>
      </div>
    </div>
  );
};

export default WasteManagementSection;
