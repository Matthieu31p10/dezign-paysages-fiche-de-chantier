
import React from 'react';
import { WorkLog } from '@/types/models';
import { ProjectInfo } from '@/types/models';
import { Card, CardContent } from "@/components/ui/card";
import BlankSheetHeader from './BlankSheetHeader';
import BlankSheetContent from './BlankSheetContent';
import BlankSheetActions from './BlankSheetActions';

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
  return (
    <Card className={`hover:border-primary/40 transition-all border-l-4 ${sheet.invoiced ? 'border-l-green-500' : 'border-l-amber-500'} hover:border-l-primary`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
          <BlankSheetContent 
            sheet={sheet} 
            linkedProject={linkedProject} 
          />
          
          <BlankSheetActions 
            sheet={sheet} 
            onEdit={onEdit}
            onExportPDF={onExportPDF}
            onPrint={onPrint}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlankSheetItem;
