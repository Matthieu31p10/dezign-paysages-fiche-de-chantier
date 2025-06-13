
import React from 'react';
import { Users } from 'lucide-react';

interface EmptyTeamStateProps {
  title: string;
  description: string;
}

const EmptyTeamState: React.FC<EmptyTeamStateProps> = ({ title, description }) => {
  return (
    <div className="p-8 text-center">
      <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <Users className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyTeamState;
