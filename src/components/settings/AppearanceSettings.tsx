
import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, LayoutGrid, Moon, Sun, RefreshCw, MonitorSmartphone } from 'lucide-react';
import { toast } from 'sonner';

const AppearanceSettings = () => {
  const { preferences, updatePreferences, updateThemeColors, updateLayoutPreferences, resetPreferences } = usePreferences();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme });
    toast.success('Thème mis à jour');
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    updateLayoutPreferences({ fontSize });
    toast.success('Taille de police mise à jour');
  };

  const handleCardStyleChange = (cardStyle: 'default' | 'minimal' | 'bordered') => {
    updateLayoutPreferences({ cardStyle });
    toast.success('Style de carte mis à jour');
  };

  const handleSidebarPositionChange = (sidebarPosition: 'left' | 'right') => {
    updateLayoutPreferences({ sidebarPosition });
    toast.success('Position de la barre latérale mise à jour');
  };

  const handleCompactModeChange = (checked: boolean) => {
    updateLayoutPreferences({ compactMode: checked });
    toast.success(checked ? 'Mode compact activé' : 'Mode compact désactivé');
  };

  const handleResetPreferences = () => {
    resetPreferences();
    toast.success('Préférences réinitialisées');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence et mise en page</CardTitle>
        <CardDescription>
          Personnalisez l'apparence et la mise en page de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="theme">
              <Palette className="h-4 w-4 mr-2" />
              Thème
            </TabsTrigger>
            <TabsTrigger value="layout">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Mise en page
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Mode d'apparence</h3>
                <RadioGroup
                  value={preferences.theme}
                  onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Clair
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Sombre
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center">
                      <MonitorSmartphone className="h-4 w-4 mr-2" />
                      Système
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Taille de police</h3>
                <RadioGroup
                  value={preferences.layout.fontSize}
                  onValueChange={(value) => handleFontSizeChange(value as 'small' | 'medium' | 'large')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Petite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Moyenne</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Grande</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Style des cartes</h3>
                <Select
                  value={preferences.layout.cardStyle}
                  onValueChange={(value) => handleCardStyleChange(value as 'default' | 'minimal' | 'bordered')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Style des cartes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Standard</SelectItem>
                    <SelectItem value="minimal">Minimaliste</SelectItem>
                    <SelectItem value="bordered">Bordure accentuée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Position de la barre latérale</h3>
                <RadioGroup
                  value={preferences.layout.sidebarPosition}
                  onValueChange={(value) => handleSidebarPositionChange(value as 'left' | 'right')}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="left" />
                    <Label htmlFor="left">Gauche</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="right" />
                    <Label htmlFor="right">Droite</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Mode compact</h3>
                  <p className="text-muted-foreground text-sm">
                    Réduit les espacements pour afficher plus de contenu
                  </p>
                </div>
                <Switch
                  checked={preferences.layout.compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleResetPreferences}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser les préférences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
