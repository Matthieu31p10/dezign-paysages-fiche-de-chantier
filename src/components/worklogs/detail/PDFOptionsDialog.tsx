
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useWorkLogDetail } from './WorkLogDetailContext';
import PDFOptionsDialogContent from './pdf-options/PDFOptionsDialogContent';

interface PDFOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PDFOptionsDialog: React.FC<PDFOptionsDialogProps> = ({ open, onOpenChange }) => {
  const { handleExportToPDF } = useWorkLogDetail();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <PDFOptionsDialogContent 
        onOpenChange={onOpenChange}
        onGeneratePDF={handleExportToPDF}
      />
    </Dialog>
  );
};

export default PDFOptionsDialog;
