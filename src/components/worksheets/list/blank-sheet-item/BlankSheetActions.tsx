
import React from 'react';
import { LoadingButton } from '@/components/ui/loading-button';
import { Pencil, Printer, FileDown } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { useLoadingState } from '@/hooks/useLoadingState';

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
  const { isLoading, setLoading } = useLoadingState();
  return (
    <div className="flex flex-wrap gap-2">
      {onEdit && (
        <LoadingButton 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(sheet.id)}
          className="text-green-600 border-green-200 hover:bg-green-50"
          loading={isLoading(`edit-${sheet.id}`)}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Modifier</span>
        </LoadingButton>
      )}
      
      {onExportPDF && (
        <LoadingButton 
          variant="outline" 
          size="sm" 
          onClick={async () => {
            setLoading(`pdf-${sheet.id}`, true);
            try {
              await onExportPDF(sheet.id);
            } finally {
              setLoading(`pdf-${sheet.id}`, false);
            }
          }}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
          loading={isLoading(`pdf-${sheet.id}`)}
          loadingText="Export..."
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">PDF</span>
        </LoadingButton>
      )}
      
      {onPrint && (
        <LoadingButton 
          variant="outline" 
          size="sm" 
          onClick={async () => {
            setLoading(`print-${sheet.id}`, true);
            try {
              await onPrint(sheet.id);
            } finally {
              setLoading(`print-${sheet.id}`, false);
            }
          }}
          className="text-gray-600 border-gray-200 hover:bg-gray-50"
          loading={isLoading(`print-${sheet.id}`)}
          loadingText="Impression..."
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Imprimer</span>
        </LoadingButton>
      )}
    </div>
  );
};

export default BlankSheetActions;
