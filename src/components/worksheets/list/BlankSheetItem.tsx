
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
            hourlyRate={sheet.hourlyRate || 0}
            hasHourlyRate={!!(sheet.hourlyRate && sheet.hourlyRate > 0)}
            totalHours={sheet.timeTracking?.totalHours || 0}
            personnelCount={sheet.personnel?.length || 1}
            totalCost={(sheet.timeTracking?.totalHours || 0) * (sheet.hourlyRate || 0) * (sheet.personnel?.length || 1)}
            quoteValue={sheet.signedQuoteAmount || 0}
            hasQuoteValue={!!(sheet.signedQuoteAmount && sheet.signedQuoteAmount > 0)}
            signedQuote={!!sheet.isQuoteSigned}
            hasSignature={!!sheet.clientSignature}
            formatNumberValue={(value) => {
              if (typeof value === 'string') {
                return parseFloat(value).toLocaleString('fr-FR', { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2 
                });
              }
              return value.toLocaleString('fr-FR', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 2 
              });
            }}
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
