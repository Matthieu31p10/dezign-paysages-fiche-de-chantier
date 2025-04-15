
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Card } from '@/components/ui/card';
import BlankSheetContent from './BlankSheetContent';
import BlankSheetActions from './BlankSheetActions';

export interface BlankSheetItemProps {
  sheet?: WorkLog;
  worklog?: WorkLog;
  linkedProject?: ProjectInfo | null;
  onEdit?: (id: string) => void;
  onExportPDF?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({
  sheet,
  worklog,
  linkedProject,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  // Use either sheet or worklog prop (for backwards compatibility)
  const sheetData = sheet || worklog;
  
  if (!sheetData) return null;
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <BlankSheetContent sheet={sheetData} linkedProject={linkedProject} />
        
        <div className="flex items-center gap-2 md:ml-auto">
          <BlankSheetActions 
            sheet={sheetData}
            onEdit={onEdit}
            onExportPDF={onExportPDF}
            onPrint={onPrint}
          />
        </div>
      </div>
    </Card>
  );
};

export default BlankSheetItem;
