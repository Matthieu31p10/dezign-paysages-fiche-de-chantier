
import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import BlankSheetHeader from './blank-sheet-item/BlankSheetHeader';
import BlankSheetContent from './blank-sheet-item/BlankSheetContent';
import BlankSheetStats from './blank-sheet-item/BlankSheetStats';
import BlankSheetActions from './blank-sheet-item/BlankSheetActions';
import { WorkLog, ProjectInfo } from '@/types/models';

interface BlankSheetItemProps {
  sheet: WorkLog;
  linkedProject: ProjectInfo | null;
  onEdit: (id: string) => void;
  onExportPDF: (id: string) => void;
  onPrint: (id: string) => void;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({
  sheet,
  linkedProject,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="border hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'flex items-start'}`}>
        <div className={`${isMobile ? 'w-full' : 'flex-grow pr-4'}`}>
          <BlankSheetHeader 
            date={sheet.date}
            clientName={sheet.clientName}
            projectId={sheet.projectId}
            registrationTime={sheet.createdAt}
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
        
        <BlankSheetActions 
          sheet={sheet}
          onEdit={onEdit}
          onExportPDF={onExportPDF}
          onPrint={onPrint}
        />
      </div>
    </Card>
  );
};

export default BlankSheetItem;
