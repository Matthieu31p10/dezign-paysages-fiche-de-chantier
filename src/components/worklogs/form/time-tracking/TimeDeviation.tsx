
import React from 'react';

interface TimeDeviationProps {
  deviation: string | null;
  deviationClass: string;
}

const TimeDeviation: React.FC<TimeDeviationProps> = ({ deviation, deviationClass }) => {
  if (deviation === null) return null;
  
  return (
    <div className="flex items-center px-3 py-2 rounded border bg-muted/30">
      <div className="text-sm">
        <span>Écart:</span> 
        <span className={`ml-2 font-medium ${deviationClass}`}>
          {Math.abs(Number(deviation)).toFixed(2)}h {Number(deviation) >= 0 ? 'sur' : 'sous'} estimé
        </span>
      </div>
    </div>
  );
};

export default TimeDeviation;
