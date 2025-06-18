
import React from 'react';
import { BlankWorksheet } from '@/types/blankWorksheet';
import { Card } from '@/components/ui/card';
import BlankSheetHeader from './blank-sheet-item/BlankSheetHeader';
import BlankSheetContent from './blank-sheet-item/BlankSheetContent';
import BlankSheetStats from './blank-sheet-item/BlankSheetStats';
import BlankSheetActions from './blank-sheet-item/BlankSheetActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlankSheetItemProps {
  sheet: BlankWorksheet;
  onEdit?: () => void;
  onExportPDF?: () => void;
  onPrint?: () => void;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({
  sheet,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  const isMobile = useIsMobile();

  // Convert BlankWorksheet to WorkLog-like structure for compatibility
  const workLogSheet = {
    ...sheet,
    projectId: sheet.linked_project_id || '',
    timeTracking: {
      totalHours: sheet.total_hours
    },
    personnel: sheet.personnel || [],
    hourlyRate: sheet.hourly_rate,
    signedQuoteAmount: sheet.signed_quote_amount || 0,
    isQuoteSigned: sheet.is_quote_signed,
    invoiced: sheet.invoiced,
    address: sheet.address,
    createdAt: sheet.created_at,
    clientName: sheet.client_name
  };

  return (
    <Card className="border hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className={`p-4 ${isMobile ? 'space-y-4' : 'flex items-start'}`}>
        <div className={`${isMobile ? 'w-full' : 'flex-grow pr-4'}`}>
          <BlankSheetHeader
            date={sheet.date}
            clientName={sheet.client_name}
            registrationTime={sheet.created_at}
            invoiced={sheet.invoiced}
          />

          <BlankSheetContent
            sheet={workLogSheet}
          />

          <BlankSheetStats
            sheet={workLogSheet}
          />
        </div>

        <BlankSheetActions
          sheet={workLogSheet}
          onEdit={onEdit}
          onExportPDF={onExportPDF}
          onPrint={onPrint}
        />
      </div>
    </Card>
  );
};

export default BlankSheetItem;
