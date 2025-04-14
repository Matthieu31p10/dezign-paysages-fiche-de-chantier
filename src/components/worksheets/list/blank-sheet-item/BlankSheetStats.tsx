
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Euro, Clock, Landmark, FileCheck, FileSignature } from 'lucide-react';
import { formatNumber } from '@/utils/format-utils';

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
    <div className="flex flex-wrap items-center gap-3 mt-2">
      {hasHourlyRate && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50">
          <Euro className="h-3 w-3 text-blue-600" />
          {formatNumberValue(hourlyRate)}€/h
        </Badge>
      )}
      
      {totalHours > 0 && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-violet-50">
          <Clock className="h-3 w-3 text-violet-600" />
          {formatNumberValue(totalHours)}h × {personnelCount} = {(totalHours * personnelCount).toFixed(1)}h
        </Badge>
      )}
      
      {hasHourlyRate && totalHours > 0 && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50">
          <Euro className="h-3 w-3 text-green-600" />
          Total: {totalCost.toFixed(2)}€
        </Badge>
      )}
      
      {hasQuoteValue && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50">
          <Landmark className="h-3 w-3 text-blue-600" />
          Devis: {formatNumber(quoteValue)}€ HT
        </Badge>
      )}
      
      {signedQuote && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50">
          <FileCheck className="h-3 w-3 text-green-600" />
          Devis signé
        </Badge>
      )}
      
      {hasSignature && (
        <Badge variant="outline" className="flex items-center gap-1 text-xs bg-amber-50">
          <FileSignature className="h-3 w-3 text-amber-600" />
          Signature client
        </Badge>
      )}
    </div>
  );
};

export default BlankSheetStats;
