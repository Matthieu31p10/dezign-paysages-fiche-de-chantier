
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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
    <Card className="h-full border-green-200 bg-gradient-to-r from-white to-green-50">
      <CardContent className="p-3 h-full flex flex-col justify-center">
        <div className="flex items-center mb-1">
          <AlertCircle className="w-4 h-4 mr-1 text-green-600" />
          <div className="text-sm text-green-700">Écart du temps de passage:</div>
        </div>
        <div className={`font-medium text-lg ${deviationClass}`}>
          {deviation}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeDeviation;
