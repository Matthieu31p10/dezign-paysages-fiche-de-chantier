
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { formatCurrency } from '@/utils/format-utils';

interface BlankSheetContentProps {
  sheet: WorkLog;
  linkedProject?: ProjectInfo | null;
}

const BlankSheetContent: React.FC<BlankSheetContentProps> = ({ sheet, linkedProject }) => {
  const totalHours = sheet.timeTracking?.totalHours || 0;
  const personnelCount = sheet.personnel?.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  
  return (
    <div className="mt-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        <div>
          <p className="text-xs text-muted-foreground">Heures équipe</p>
          <p className="font-medium">{totalTeamHours.toFixed(2)}h</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground">Personnel</p>
          <p className="font-medium">{personnelCount} personne{personnelCount > 1 ? 's' : ''}</p>
        </div>
        
        {sheet.hourlyRate && (
          <div>
            <p className="text-xs text-muted-foreground">Taux horaire</p>
            <p className="font-medium">{formatCurrency(sheet.hourlyRate)}/h</p>
          </div>
        )}
        
        {sheet.signedQuoteAmount > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Devis signé</p>
            <p className="font-medium">{formatCurrency(sheet.signedQuoteAmount)}</p>
          </div>
        )}
      </div>
      
      {sheet.address && (
        <p className="text-sm text-muted-foreground truncate mt-1">{sheet.address}</p>
      )}
    </div>
  );
};

export default BlankSheetContent;
