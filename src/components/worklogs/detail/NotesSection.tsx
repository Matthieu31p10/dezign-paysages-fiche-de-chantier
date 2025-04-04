
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWorkLogDetail } from './WorkLogDetailContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
         AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
         AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const NotesSection: React.FC = () => {
  const { notes, setNotes, handleSaveNotes } = useWorkLogDetail();
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Sécurité: limiter la taille des notes
    if (e.target.value.length <= 2000) {
      setNotes(e.target.value);
    } else {
      // Tronquer si dépasse la limite
      setNotes(e.target.value.substring(0, 2000));
    }
  };
  
  const confirmSaveNotes = () => {
    handleSaveNotes();
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-500">Notes et observations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Textarea 
            value={notes} 
            onChange={handleNotesChange} 
            placeholder="Ajoutez vos notes et observations ici..."
            rows={4}
            maxLength={2000}
            className="resize-y"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {notes.length}/2000 caractères
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm">
                  Enregistrer les notes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer l'enregistrement</AlertDialogTitle>
                  <AlertDialogDescription>
                    Voulez-vous enregistrer ces notes pour cette fiche de suivi ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSaveNotes}>
                    Enregistrer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
