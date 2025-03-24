
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateSettings } = useApp();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(settings.companyLogo);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le logo ne doit pas dépasser 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      companyLogo: logoPreview
    });
    toast.success('Logo enregistré avec succès');
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    updateSettings({
      companyLogo: undefined
    });
    toast.success('Logo supprimé');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre application
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Logo de l'entreprise</CardTitle>
          <CardDescription>
            Ajoutez votre logo d'entreprise pour l'afficher sur les documents et rapports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {logoPreview ? (
              <div className="relative w-64 h-64 border rounded-lg overflow-hidden flex items-center justify-center p-4">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
                <img 
                  src={logoPreview} 
                  alt="Logo de l'entreprise" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-64 h-64 border rounded-lg flex flex-col items-center justify-center gap-4 bg-muted/30">
                <Image className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground text-center px-6">
                  Aucun logo n'a été téléchargé. Veuillez ajouter votre logo d'entreprise.
                </p>
              </div>
            )}
            
            <div className="space-y-2 w-full max-w-md">
              <Label htmlFor="logo">Télécharger un logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={logoPreview === settings.companyLogo}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Formats supportés: PNG, JPG, GIF. Taille maximale: 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
