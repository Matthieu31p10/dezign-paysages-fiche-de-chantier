
import React from 'react';
import { Clock, Euro, FileCheck, FileSignature } from 'lucide-react';

interface BlankSheetStatsProps {
  hourlyRate: number;
  hasHourlyRate: boolean;
  totalHours: number;
  personnelCount: number;
  totalCost: number;
  quoteValue: number;
  hasQuoteValue: boolean;
  signedQuote: boolean;
  hasSignature: boolean;
  formatNumberValue: (value: string | number) => string;
}

const BlankSheetStats: React.FC<BlankSheetStatsProps> = ({
  hourlyRate,
  hasHourlyRate,
  totalHours,
  personnelCount,
  totalCost,
  quoteValue,
  hasQuoteValue,
  signedQuote,
  hasSignature,
  formatNumberValue
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      <div className="flex items-center text-sm">
        <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
        <span>
          <span className="font-medium">{formatNumberValue(totalHours)}</span> heures
          {personnelCount > 1 && ` × ${personnelCount}`}
        </span>
      </div>
      
      {hasHourlyRate && (
        <div className="flex items-center text-sm">
          <Euro className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <span>
            <span className="font-medium">{hourlyRate}</span> €/h
            {totalCost > 0 && ` (${Math.round(totalCost)} € total)`}
          </span>
        </div>
      )}
      
      {hasQuoteValue && (
        <div className="flex items-center text-sm">
          <FileCheck className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <span>
            Devis: <span className="font-medium">{Math.round(quoteValue)}</span> €
          </span>
        </div>
      )}
      
      {signedQuote && (
        <div className="flex items-center text-sm">
          <FileSignature className="w-3.5 h-3.5 mr-1.5 text-green-500" />
          <span className="text-green-600">Devis signé</span>
        </div>
      )}
      
      {hasSignature && (
        <div className="flex items-center text-sm">
          <FileSignature className="w-3.5 h-3.5 mr-1.5 text-green-500" />
          <span className="text-green-600">Signature client</span>
        </div>
      )}
    </div>
  );
};

export default BlankSheetStats;
