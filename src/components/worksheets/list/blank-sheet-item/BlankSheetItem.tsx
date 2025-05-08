
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import BlankSheetHeader from './BlankSheetHeader';
import BlankSheetContent from './BlankSheetContent';
import BlankSheetStats from './BlankSheetStats';
import BlankSheetActions from './BlankSheetActions';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { Badge } from '@/components/ui/badge';
import { formatDateToFr } from '@/utils/date-utils';

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
  const { updateWorkLog } = useWorkLogs();
  const isMobile = useIsMobile();
  
  // Gérer le changement du statut de facturation
  const handleInvoicedChange = async (checked: boolean) => {
    if (sheet && sheet.id) {
      await updateWorkLog({
        ...sheet,
        invoiced: checked
      });
    }
  };
  
  // Handler functions
  const handleEdit = () => onEdit(sheet.id);
  const handleExportPDF = () => onExportPDF(sheet.id);
  const handlePrint = () => onPrint(sheet.id);
  
  // Format invoice amount for display
  const invoiceAmount = sheet.hourlyRate && sheet.timeTracking?.totalHours 
    ? (sheet.hourlyRate * sheet.timeTracking.totalHours).toFixed(2) 
    : "0.00";
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow animate-fade-in border border-blue-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={sheet.invoiced || false}
                onCheckedChange={handleInvoicedChange}
                id={`invoiced-${sheet.id}`}
              />
              <label 
                htmlFor={`invoiced-${sheet.id}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Facturée
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">
                Fiche vierge
              </Badge>
              {sheet.invoiced && (
                <Badge className="bg-green-600">
                  Facturée
                </Badge>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <BlankSheetHeader 
                date={sheet.date}
                clientName={sheet.clientName}
                projectId={sheet.projectId}
                registrationTime={sheet.createdAt}
                invoiced={sheet.invoiced}
              />
            </div>
            
            <div className="text-right md:border-l md:pl-4">
              <div className="text-gray-600 text-sm">Total facturable</div>
              <div className="text-lg font-semibold text-blue-800">
                {invoiceAmount} €
              </div>
              <div className="text-gray-500 text-xs">
                {sheet.timeTracking?.totalHours || 0} h × {sheet.hourlyRate || 0} €/h
              </div>
              {sheet.signedQuoteAmount > 0 && (
                <div className="mt-1 text-sm">
                  <span className="text-gray-600">Montant devis:</span> {sheet.signedQuoteAmount} €
                </div>
              )}
            </div>
          </div>
          
          <BlankSheetContent 
            sheet={sheet}
            linkedProject={linkedProject}
          />
          
          <BlankSheetStats 
            sheet={sheet}
          />
        </div>
        
        <div className="flex items-start justify-end mt-2">
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
