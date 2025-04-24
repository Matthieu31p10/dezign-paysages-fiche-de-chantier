
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Card } from '@/components/ui/card';
import BlankSheetContent from './BlankSheetContent';
import BlankSheetActions from './BlankSheetActions';
import BlankSheetHeader from './BlankSheetHeader';
import BlankSheetStats from './BlankSheetStats';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  if (!sheetData) return null;
  
  const handleEdit = () => {
    if (onEdit && sheetData.id) {
      onEdit(sheetData.id);
    }
  };
  
  const handleExportPDF = () => {
    if (onExportPDF && sheetData.id) {
      onExportPDF(sheetData.id);
    }
  };
  
  const handlePrint = () => {
    if (onPrint && sheetData.id) {
      onPrint(sheetData.id);
    }
  };
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <BlankSheetHeader 
            sheet={sheetData}
            clientName={sheetData.clientName}
            projectId={sheetData.projectId}
            date={sheetData.date}
            registrationTime={sheetData.createdAt}
            invoiced={sheetData.invoiced}
          />
          
          <BlankSheetContent 
            sheet={sheetData}
          />
          
          <BlankSheetStats 
            sheet={sheetData}
          />
        </div>
        
        <div className="flex items-center gap-2 md:ml-auto">
          <BlankSheetActions 
            sheet={sheetData}
            onEdit={handleEdit}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />
        </div>
      </div>
    </Card>
  );
};

export default BlankSheetItem;
