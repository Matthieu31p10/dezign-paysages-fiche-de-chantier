
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Mail, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkLogDetail } from './WorkLogDetailContext';
import PDFOptionsDialog from './PDFOptionsDialog';

interface HeaderActionsProps {
  workLogId: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ workLogId }) => {
  const navigate = useNavigate();
  const { confirmDelete, handleSendEmail } = useWorkLogDetail();
  const [isPDFDialogOpen, setIsPDFDialogOpen] = useState(false);
  
  const handleEditClick = () => {
    console.log("Navigating to edit page for worklog:", workLogId);
    navigate(`/worklogs/edit/${workLogId}`);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsPDFDialogOpen(true)}
      >
        <FileText className="w-4 h-4 mr-2" />
        Exporter en PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSendEmail}
      >
        <Mail className="w-4 h-4 mr-2" />
        Envoyer par email
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleEditClick}
      >
        <Edit className="w-4 h-4 mr-2" />
        Modifier
      </Button>
      
      <Button 
        variant="destructive" 
        size="sm"
        onClick={confirmDelete}
      >
        <Trash className="w-4 h-4 mr-2" />
        Supprimer
      </Button>
      
      <PDFOptionsDialog
        open={isPDFDialogOpen}
        onOpenChange={setIsPDFDialogOpen}
      />
    </div>
  );
};

export default HeaderActions;
