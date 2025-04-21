
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clipboard, CheckCircle2, XCircle } from 'lucide-react';
import { WorkLog } from '@/types/models';

interface BlankSheetStatsProps {
  sheet: WorkLog;
}

const BlankSheetStats: React.FC<BlankSheetStatsProps> = ({ sheet }) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sheet.wasteManagement && sheet.wasteManagement !== 'none' && (
        <Badge variant="outline" className="text-xs">
          {sheet.wasteManagement.includes('big_bag') && 'Big-bag'}
          {sheet.wasteManagement.includes('half_dumpster') && '½ Benne'}
          {sheet.wasteManagement.includes('dumpster') && 'Benne'}
          {sheet.wasteManagement.includes('small_container') && 'Petit container'}
          {sheet.wasteManagement.includes('large_container') && 'Grand container'}
          {' - '}
          {sheet.wasteManagement.split('_')[1] || '1'} unité(s)
        </Badge>
      )}
      
      {sheet.isQuoteSigned !== undefined && (
        <Badge variant={sheet.isQuoteSigned ? "secondary" : "outline"} className="text-xs">
          {sheet.isQuoteSigned ? (
            <>
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Devis signé
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              Devis non signé
            </>
          )}
        </Badge>
      )}
      
      {sheet.tasks && (
        <Badge variant="outline" className="text-xs">
          <Clipboard className="h-3 w-3 mr-1" />
          {sheet.tasks.length > 30 ? `${sheet.tasks.substring(0, 30)}...` : sheet.tasks}
        </Badge>
      )}
    </div>
  );
};

export default BlankSheetStats;
