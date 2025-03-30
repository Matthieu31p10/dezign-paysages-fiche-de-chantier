
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload, X, Building, Save } from 'lucide-react';
import { toast } from 'sonner';
import { CompanyInfo } from '@/types/models';

const LogoSettings = () => {
  const { settings, updateSettings } = useApp();
  const [logoPreview, setLogoPreview] = useState<string | undefined>(settings.companyLogo);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(
    settings.companyInfo || {
      name: '',
      address: '',
      managerName: '',
      phone: '',
      email: ''
    }
  );

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

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCompanyInfo = () => {
    updateSettings({
      companyInfo
    });
    toast.success('Informations de l\'entreprise enregistrées avec succès');
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations de l'entreprise
          </CardTitle>
          <CardDescription>
            Ces informations seront affichées sur tous les documents PDF générés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input
                  id="company-name"
                  value={companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-address">Adresse</Label>
                <Input
                  id="company-address"
                  value={companyInfo.address}
                  onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                  placeholder="Adresse complète"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-manager">Nom et prénom du gérant</Label>
                <Input
                  id="company-manager"
                  value={companyInfo.managerName}
                  onChange={(e) => handleCompanyInfoChange('managerName', e.target.value)}
                  placeholder="Nom et prénom du gérant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-phone">Téléphone</Label>
                <Input
                  id="company-phone"
                  value={companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                  placeholder="Numéro de téléphone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  value={companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                  placeholder="Adresse email"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSaveCompanyInfo}
              className="mt-4 w-full md:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les informations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoSettings;
