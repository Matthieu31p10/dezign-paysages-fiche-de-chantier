
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { FileText, FilePlus } from 'lucide-react';

interface GeneratePDFDialogProps {
  onGenerate: () => void;
  disabled: boolean;
  isBlank?: boolean;
}

const GeneratePDFDialog = ({ onGenerate, disabled, isBlank = false }: GeneratePDFDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          disabled={disabled}
          className="w-full"
        >
          {isBlank ? (
            <FilePlus className="h-4 w-4 mr-2" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Générer PDF
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Générer un PDF</AlertDialogTitle>
          <AlertDialogDescription>
            Voulez-vous générer un PDF pour la fiche {isBlank ? 'vierge' : 'de suivi'} sélectionnée ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onGenerate}>
            Générer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GeneratePDFDialog;
