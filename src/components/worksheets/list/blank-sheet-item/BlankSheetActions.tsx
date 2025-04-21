
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Printer, FileDown } from 'lucide-react';
import { WorkLog } from '@/types/models';

interface BlankSheetActionsProps {
  sheet: WorkLog;
  onEdit?: (id: string) => void;
  onExportPDF?: (id: string) => void;
  onPrint?: (id: string) => void;
}

const BlankSheetActions: React.FC<BlankSheetActionsProps> = ({
  sheet,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(sheet.id)}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Modifier</span>
        </Button>
      )}
      
      {onExportPDF && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onExportPDF(sheet.id)}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">PDF</span>
        </Button>
      )}
      
      {onPrint && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPrint(sheet.id)}
          className="text-gray-600 border-gray-200 hover:bg-gray-50"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Imprimer</span>
        </Button>
      )}
    </div>
  );
};

export default BlankSheetActions;
