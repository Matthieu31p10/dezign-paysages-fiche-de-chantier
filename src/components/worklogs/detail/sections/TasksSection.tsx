
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const TasksSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  if (!workLog?.tasks) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
        Tâches réalisées
      </h3>
      
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="whitespace-pre-wrap text-sm">
          {workLog.tasks}
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
