import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileText, Clock } from 'lucide-react';

interface DraftRecoveryDialogProps {
  isOpen: boolean;
  onRestore: () => void;
  onDismiss: () => void;
  draftAge: string;
}

const DraftRecoveryDialog: React.FC<DraftRecoveryDialogProps> = ({
  isOpen,
  onRestore,
  onDismiss,
  draftAge
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Brouillon détecté
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Un brouillon de vos modifications a été trouvé. 
              Souhaitez-vous le restaurer ?
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Dernière sauvegarde: {draftAge}</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDismiss}>
            Non, recommencer
          </AlertDialogCancel>
          <AlertDialogAction onClick={onRestore}>
            Oui, restaurer le brouillon
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DraftRecoveryDialog;