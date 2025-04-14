
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { FileText, Printer, Download } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { useWorkLogs } from '@/context/WorkLogsContext';
import { toast } from 'sonner';

interface BlankSheetActionsProps {
  sheet: WorkLog;
  onEdit: (id: string) => void;
  onExportPDF: (id: string) => void;
  onPrint: (id: string) => void;
}

const BlankSheetActions: React.FC<BlankSheetActionsProps> = ({
  sheet,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  const { updateWorkLog } = useWorkLogs();
  
  // Calculate total hours for display
  const totalHours = sheet.timeTracking?.totalHours || 0;
  const personnelCount = sheet.personnel?.length || 1;
  // Ensure we have a number
  const calcTotalHours = typeof totalHours === 'number' ? totalHours : parseFloat(totalHours as string) || 0;

  // Helper function to ensure numbers for formatting
  const formatNumberValue = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return parseFloat(value || '0').toFixed(2);
  };

  const handleInvoiceToggle = (checked: boolean) => {
    updateWorkLog(sheet.id, { invoiced: checked });
    toast.success(`Fiche ${checked ? 'marquée comme facturée' : 'marquée comme non facturée'}`);
  };

  return (
    <div className="flex items-center gap-2 mt-2 md:mt-0">
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            id={`invoiced-${sheet.id}`}
            checked={sheet.invoiced || false}
            onCheckedChange={handleInvoiceToggle}
            className="h-4 w-4 data-[state=checked]:bg-green-600"
          />
          <Label 
            htmlFor={`invoiced-${sheet.id}`}
            className="text-xs cursor-pointer select-none"
          >
            Facturée
          </Label>
        </div>
      </div>

      <div className="text-right mr-2 bg-muted/30 px-3 py-1 rounded-md">
        <div className="text-sm font-medium">
          {formatNumberValue(calcTotalHours)} h
        </div>
        <div className="text-xs text-muted-foreground">
          {personnelCount > 1 ? `× ${personnelCount} = ${(calcTotalHours * personnelCount).toFixed(1)}h` : 'Durée'}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExportPDF(sheet.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter en PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPrint(sheet.id)}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(sheet.id);
        }}
      >
        Modifier
      </Button>
    </div>
  );
};

export default BlankSheetActions;
