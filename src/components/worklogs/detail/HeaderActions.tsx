
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useWorkLogDetail } from './WorkLogDetailContext';

interface HeaderActionsProps {
  workLogId: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ workLogId }) => {
  const navigate = useNavigate();
  const { handleDeleteWorkLog, handleExportToPDF, handleSendEmail } = useWorkLogDetail();
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleExportToPDF}
      >
        <FileText className="w-4 h-4 mr-2" />
        Exporter PDF
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
        onClick={() => navigate(`/worklogs/edit/${workLogId}`)}
      >
        <Edit className="w-4 h-4 mr-2" />
        Modifier
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement la fiche de suivi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkLog}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HeaderActions;
