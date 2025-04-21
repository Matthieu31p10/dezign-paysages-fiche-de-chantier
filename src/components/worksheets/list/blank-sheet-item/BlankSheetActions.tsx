
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Printer, FileDown, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkLog } from '@/types/models';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handleEdit = () => {
    if (onEdit) onEdit(sheet.id);
  };
  
  const handleExportPDF = () => {
    if (onExportPDF) onExportPDF(sheet.id);
  };
  
  const handlePrint = () => {
    if (onPrint) onPrint(sheet.id);
  };
  
  return (
    <>
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleEdit} 
            variant="ghost" 
            size="sm"
            className="whitespace-nowrap"
          >
            <Edit className="w-4 h-4 mr-1.5" />
            Modifier
          </Button>
          
          <Button 
            onClick={handleExportPDF} 
            variant="ghost" 
            size="sm"
            className="whitespace-nowrap"
          >
            <FileDown className="w-4 h-4 mr-1.5" />
            PDF
          </Button>
          
          <Button 
            onClick={handlePrint} 
            variant="ghost" 
            size="sm"
            className="whitespace-nowrap"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Imprimer
          </Button>
        </div>
      )}
      
      {isMobile && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                Exporter PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};

export default BlankSheetActions;
