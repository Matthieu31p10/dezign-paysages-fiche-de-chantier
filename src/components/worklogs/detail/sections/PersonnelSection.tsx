
import React from 'react';
import { User } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const PersonnelSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500">Personnel présent</h3>
      <div className="space-y-1">
        {workLog.personnel.map((person, index) => (
          <p key={index} className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            {person}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PersonnelSection;
