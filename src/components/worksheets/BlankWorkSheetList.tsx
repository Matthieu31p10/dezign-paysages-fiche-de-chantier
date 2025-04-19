
import React from 'react';
import { WorkLog } from '@/types/models';
import EmptyBlankWorkSheetState from './EmptyBlankWorkSheetState';
import BlankSheetItem from './list/blank-sheet-item';
import { groupWorkLogsByMonth } from '@/utils/date-helpers';
import { sortMonths } from '../worklogs/list/utils';

export interface BlankWorkSheetListProps {
  sheets: WorkLog[];
  onCreateNew: () => void;
  onEdit: (workLogId: string) => void;
  onExportPDF: (id: string) => Promise<void>;
  onPrint: (id: string) => Promise<void>;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({
  sheets,
  onCreateNew,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  // If there are no worksheets, show empty state
  if (!sheets || sheets.length === 0) {
    return <EmptyBlankWorkSheetState onCreateNew={onCreateNew} />;
  }
  
  // Group worksheets by month
  const sheetsByMonth = groupWorkLogsByMonth(sheets);
  
  // Sort months in reverse chronological order
  const sortedMonths = sortMonths(Object.keys(sheetsByMonth), 'date-desc');
  
  return (
    <div className="space-y-8 animate-fade-in">
      {sortedMonths.map(month => (
        <div key={month} className="space-y-4">
          <h2 className="text-xl font-semibold text-green-800 border-b border-green-100 pb-2">
            {month}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {sheetsByMonth[month].map(sheet => (
              <BlankSheetItem
                key={sheet.id}
                sheet={sheet}
                onEdit={() => onEdit(sheet.id)}
                onExportPDF={() => onExportPDF(sheet.id)}
                onPrint={() => onPrint(sheet.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlankWorkSheetList;
