
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TeamBadgeProps {
  teamName: string;
  teamColor: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TeamBadge: React.FC<TeamBadgeProps> = ({ 
  teamName, 
  teamColor, 
  size = 'sm',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5', 
    lg: 'text-base px-4 py-2'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  return (
    <Badge 
      variant="outline" 
      className={`inline-flex items-center gap-1.5 border-border bg-card ${sizeClasses[size]} ${className}`}
    >
      <div 
        className={`${dotSizes[size]} rounded-full`}
        style={{ backgroundColor: teamColor }}
      />
      <span className="font-medium text-gray-700">{teamName}</span>
    </Badge>
  );
};

export default TeamBadge;
