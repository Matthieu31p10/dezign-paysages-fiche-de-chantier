
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TimeDeviationProps {
  deviation: string;
  deviationClass: string;
  showInBlankSheets?: boolean;
}

const TimeDeviation: React.FC<TimeDeviationProps> = ({ 
  deviation, 
  deviationClass,
  showInBlankSheets = true
}) => {
  if (!showInBlankSheets) return null;
  
  return (
    <Card className="h-full">
      <CardContent className="p-3 h-full flex flex-col justify-center">
        <div className="text-sm text-muted-foreground mb-1">Écart du temps de passage:</div>
        <div className={`font-medium text-lg ${deviationClass}`}>
          {deviation}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeDeviation;
