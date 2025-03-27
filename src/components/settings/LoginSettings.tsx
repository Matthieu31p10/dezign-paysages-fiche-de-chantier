
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const LoginSettings = () => {
  const { settings, updateSettings } = useApp();
  const [backgroundPreview, setBackgroundPreview] = useState<string | undefined>(settings.loginBackgroundImage);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBackgroundPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      loginBackgroundImage: backgroundPreview
    });
    toast.success('Image d\'arrière-plan enregistrée avec succès');
  };

  const handleRemoveBackground = () => {
    setBackgroundPreview(undefined);
    updateSettings({
      loginBackgroundImage: undefined
    });
    toast.success('Image d\'arrière-plan supprimée');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Écran de connexion</CardTitle>
        <CardDescription>
          Personnalisez l'image d'arrière-plan de l'écran de connexion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          {backgroundPreview ? (
            <div className="relative w-full h-48 md:h-64 border rounded-lg overflow-hidden">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 z-10"
                onClick={handleRemoveBackground}
              >
                <X className="h-4 w-4" />
              </Button>
              <img 
                src={backgroundPreview} 
                alt="Arrière-plan de connexion" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 md:h-64 border rounded-lg flex flex-col items-center justify-center gap-4 bg-muted/30">
              <Image className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground text-center px-6">
                Aucune image d'arrière-plan n'a été téléchargée. Veuillez ajouter une image pour personnaliser l'écran de connexion.
              </p>
            </div>
          )}
          
          <div className="space-y-2 w-full max-w-md">
            <Label htmlFor="background">Télécharger une image d'arrière-plan</Label>
            <div className="flex gap-2">
              <Input
                id="background"
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="cursor-pointer"
              />
              <Button 
                onClick={handleSaveSettings} 
                disabled={backgroundPreview === settings.loginBackgroundImage}
              >
                <Upload className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Formats supportés: PNG, JPG, GIF. Taille maximale: 5MB. Résolution recommandée: 1920x1080.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginSettings;
