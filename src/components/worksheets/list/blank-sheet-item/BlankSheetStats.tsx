
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format-utils';
import { CheckCircle } from 'lucide-react';

interface BlankSheetStatsProps {
  sheet: any;
}

const BlankSheetStats: React.FC<BlankSheetStatsProps> = ({ sheet }) => {
  const hasHourlyRate = !!sheet.hourlyRate && sheet.hourlyRate > 0;
  const hasQuoteValue = !!sheet.signedQuoteAmount && sheet.signedQuoteAmount > 0;
  const totalHours = sheet.timeTracking?.totalHours || 0;
  const personnelCount = sheet.personnel?.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  
  // Calculate potential income based on hourly rate
  const totalCost = hasHourlyRate ? totalTeamHours * sheet.hourlyRate : 0;
  
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {hasHourlyRate && (
        <Badge variant="outline" className="bg-white">
          Taux: {formatCurrency(sheet.hourlyRate)}/h
        </Badge>
      )}
      
      {totalTeamHours > 0 && (
        <Badge variant="outline" className="bg-white">
          {totalTeamHours.toFixed(1)}h d'équipe
        </Badge>
      )}
      
      {hasHourlyRate && totalCost > 0 && (
        <Badge variant="outline" className="bg-white">
          Total: {formatCurrency(totalCost)}
        </Badge>
      )}
      
      {hasQuoteValue && (
        <Badge 
          variant={sheet.isQuoteSigned ? "secondary" : "outline"} 
          className={sheet.isQuoteSigned ? "bg-green-100 text-green-800 border-green-200" : "bg-white"}
        >
          {sheet.isQuoteSigned && <CheckCircle className="h-3 w-3 mr-1" />}
          Devis: {formatCurrency(sheet.signedQuoteAmount)}
        </Badge>
      )}
      
      {sheet.invoiced && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
          Facturé
        </Badge>
      )}
    </div>
  );
};

export default BlankSheetStats;
