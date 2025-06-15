
import React from 'react';
import { BlankWorksheet } from '@/types/blankWorksheet';
import { ProjectInfo } from '@/types/models';
import { Card } from '@/components/ui/card';
import BlankSheetContent from './blank-sheet-item/BlankSheetContent';
import BlankSheetActions from './blank-sheet-item/BlankSheetActions';
import BlankSheetHeader from './blank-sheet-item/BlankSheetHeader';
import BlankSheetStats from './blank-sheet-item/BlankSheetStats';
import { useIsMobile } from '@/hooks/use-mobile';

export interface BlankSheetItemProps {
  sheet: BlankWorksheet;
  linkedProject?: ProjectInfo | null;
  onEdit?: (id: string) => void;
  onExportPDF?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({
  sheet,
  linkedProject,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  const isMobile = useIsMobile();
  
  const handleEdit = () => {
    if (onEdit && sheet.id) {
      onEdit(sheet.id);
    }
  };
  
  const handleExportPDF = () => {
    if (onExportPDF && sheet.id) {
      onExportPDF(sheet.id);
    }
  };
  
  const handlePrint = () => {
    if (onPrint && sheet.id) {
      onPrint(sheet.id);
    }
  };
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <BlankSheetHeader 
            sheet={sheet}
            clientName={sheet.client_name}
            date={sheet.date}
            registrationTime={sheet.created_at}
            invoiced={sheet.invoiced}
          />
          
          <BlankSheetContent 
            sheet={sheet}
            linkedProject={linkedProject}
          />
          
          <BlankSheetStats 
            sheet={sheet}
          />
        </div>
        
        <div className="flex items-center gap-2 md:ml-auto">
          <BlankSheetActions 
            sheet={sheet}
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
