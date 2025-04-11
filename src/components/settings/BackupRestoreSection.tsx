
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBackupZip, restoreFromZip } from '@/utils/backupUtils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BackupRestoreSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleBackup = async () => {
    setIsCreatingBackup(true);
    try {
      await createBackupZip();
    } finally {
      setIsCreatingBackup(false);
    }
  };
  
  const handleRestoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Réinitialiser le champ de fichier pour pouvoir sélectionner le même fichier plusieurs fois
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setDialogOpen(true);
    
    // Stocker le fichier pour l'utiliser lors de la confirmation
    const zipFile = file;
    
    // L'utilisateur confirme via la boîte de dialogue
    const confirmRestore = async () => {
      setIsRestoring(true);
      setDialogOpen(false);
      
      try {
        const success = await restoreFromZip(zipFile);
        if (success) {
          toast.success("Restauration terminée. Veuillez recharger la page pour voir les changements.");
        }
      } finally {
        setIsRestoring(false);
      }
    };
    
    // Attacher la fonction de confirmation à window pour y accéder depuis la boîte de dialogue
    (window as any).confirmRestore = confirmRestore;
  };
  
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Sauvegarde et restauration</CardTitle>
        <CardDescription>
          Sauvegardez vos données ou restaurez une sauvegarde précédente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Sauvegarder vos données</h3>
            <p className="text-sm text-muted-foreground">
              Créez un fichier ZIP contenant toutes vos données (projets, fiches de suivi, équipes, etc.)
            </p>
            <Button 
              onClick={handleBackup} 
              disabled={isCreatingBackup}
              className="w-full mt-2"
            >
              {isCreatingBackup ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger une sauvegarde
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-medium">Restaurer une sauvegarde</h3>
            <p className="text-sm text-muted-foreground">
              Importez un fichier ZIP de sauvegarde pour restaurer vos données
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".zip" 
              className="hidden" 
            />
            <Button
              variant="outline"
              onClick={handleRestoreClick}
              disabled={isRestoring}
              className="w-full mt-2"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restauration en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importer une sauvegarde
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            La restauration d'une sauvegarde remplacera toutes vos données actuelles. 
            Assurez-vous de créer une sauvegarde avant de procéder à une restauration.
          </AlertDescription>
        </Alert>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la restauration</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de restaurer une sauvegarde. Cette action remplacera toutes vos données actuelles et ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          <Alert className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Après la restauration, la page sera rechargée pour appliquer les changements.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (typeof (window as any).confirmRestore === 'function') {
                  (window as any).confirmRestore();
                }
              }}
            >
              Confirmer la restauration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BackupRestoreSection;
