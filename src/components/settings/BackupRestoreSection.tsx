
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Upload, AlertTriangle, Database } from 'lucide-react';
import { backupData, restoreData } from '@/utils/backupUtils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const BackupRestoreSection = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      await backupData();
      toast({
        title: "Sauvegarde réussie",
        description: "Vos données ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde des données.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };
  
  const handleRestore = async () => {
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier de sauvegarde.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsRestoring(true);
      await restoreData(file);
      toast({
        title: "Restauration réussie",
        description: "Vos données ont été restaurées avec succès. La page va se recharger.",
      });
      
      // Reload the page after successful restore
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Restore error:", error);
      toast({
        title: "Erreur de restauration",
        description: "Une erreur est survenue lors de la restauration des données.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
      setFile(null);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            Sauvegarde et restauration
          </CardTitle>
          <CardDescription>
            Sauvegardez et restaurez toutes les données de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sauvegarde des données</h3>
            <p className="text-sm text-muted-foreground">
              Téléchargez une copie de toutes vos données (projets, fiches de suivi, paramètres, etc.)
            </p>
            <Button 
              onClick={handleBackup} 
              disabled={isBackingUp}
              className="mt-2"
            >
              {isBackingUp ? "Sauvegarde en cours..." : "Télécharger la sauvegarde"}
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              La restauration remplacera toutes les données actuelles. Cette action est irréversible.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Restauration des données</h3>
            <p className="text-sm text-muted-foreground">
              Restaurez vos données à partir d'une sauvegarde
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  <Upload className="mr-2 h-4 w-4" />
                  Restaurer une sauvegarde
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Restaurer les données</DialogTitle>
                  <DialogDescription>
                    Sélectionnez un fichier de sauvegarde pour restaurer vos données. Attention, cette action remplacera toutes les données actuelles.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-file">Fichier de sauvegarde</Label>
                    <Input 
                      id="backup-file" 
                      type="file" 
                      accept=".zip" 
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="destructive" 
                    disabled={!file || isRestoring}
                    onClick={handleRestore}
                  >
                    {isRestoring ? "Restauration en cours..." : "Restaurer les données"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BackupRestoreSection;
