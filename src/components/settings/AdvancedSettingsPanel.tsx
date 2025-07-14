import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/context/SettingsContext';
import { Save, Database, Clock, Bell, Palette, User } from 'lucide-react';
import { toast } from 'sonner';

const AdvancedSettingsPanel: React.FC = () => {
  const {
    supabaseSettings,
    updateSetting,
    updateUserPreferences,
    updateAppConfiguration,
    updateNotificationPreferences,
    supabaseLoading
  } = useSettings();

  const [localSettings, setLocalSettings] = useState({
    hourlyRate: supabaseSettings.hourly_rate || 45,
    vatRate: supabaseSettings.vat_rate || '20',
    defaultWorkStartTime: supabaseSettings.default_work_start_time || '08:00',
    defaultWorkEndTime: supabaseSettings.default_work_end_time || '17:00',
    defaultBreakTime: supabaseSettings.default_break_time || '30',
    autoSaveEnabled: supabaseSettings.auto_save_enabled || true,
    themePreference: supabaseSettings.theme_preference || 'system',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: supabaseSettings.notification_preferences?.email || true,
    browser: supabaseSettings.notification_preferences?.browser || true,
    reminders: supabaseSettings.notification_preferences?.reminders || true,
  });

  const handleSaveBasicSettings = async () => {
    try {
      await updateSetting('hourly_rate', localSettings.hourlyRate);
      await updateSetting('vat_rate', localSettings.vatRate);
      await updateSetting('default_work_start_time', localSettings.defaultWorkStartTime);
      await updateSetting('default_work_end_time', localSettings.defaultWorkEndTime);
      await updateSetting('default_break_time', localSettings.defaultBreakTime);
      await updateSetting('auto_save_enabled', localSettings.autoSaveEnabled);
      await updateSetting('theme_preference', localSettings.themePreference);
      
      toast.success('Paramètres de base sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotificationPreferences(notificationSettings);
      toast.success('Préférences de notification sauvegardées');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des notifications');
    }
  };

  const handleUpdateLocalSetting = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateNotificationSetting = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  if (supabaseLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement des paramètres...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Paramètres Avancés</CardTitle>
          </div>
          <CardDescription>
            Configuration complète de l'application avec sauvegarde automatique
          </CardDescription>
          <Badge variant="outline" className="w-fit">
            Synchronisé avec Supabase
          </Badge>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Base
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Avancé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Base</CardTitle>
              <CardDescription>
                Configuration des valeurs par défaut pour les chantiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Taux horaire par défaut (€)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={localSettings.hourlyRate}
                    onChange={(e) => handleUpdateLocalSetting('hourlyRate', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatRate">Taux de TVA (%)</Label>
                  <Select 
                    value={localSettings.vatRate} 
                    onValueChange={(value) => handleUpdateLocalSetting('vatRate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="5.5">5.5%</SelectItem>
                      <SelectItem value="0">0%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Heure de début par défaut</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={localSettings.defaultWorkStartTime}
                    onChange={(e) => handleUpdateLocalSetting('defaultWorkStartTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Heure de fin par défaut</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={localSettings.defaultWorkEndTime}
                    onChange={(e) => handleUpdateLocalSetting('defaultWorkEndTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breakTime">Pause par défaut (min)</Label>
                  <Input
                    id="breakTime"
                    type="number"
                    value={localSettings.defaultBreakTime}
                    onChange={(e) => handleUpdateLocalSetting('defaultBreakTime', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave">Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement les modifications
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={localSettings.autoSaveEnabled}
                  onCheckedChange={(checked) => handleUpdateLocalSetting('autoSaveEnabled', checked)}
                />
              </div>

              <Button onClick={handleSaveBasicSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres de base
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotif">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => handleUpdateNotificationSetting('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browserNotif">Notifications navigateur</Label>
                    <p className="text-sm text-muted-foreground">
                      Afficher des notifications dans le navigateur
                    </p>
                  </div>
                  <Switch
                    id="browserNotif"
                    checked={notificationSettings.browser}
                    onCheckedChange={(checked) => handleUpdateNotificationSetting('browser', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminders">Rappels automatiques</Label>
                    <p className="text-sm text-muted-foreground">
                      Rappels pour les tâches et échéances importantes
                    </p>
                  </div>
                  <Switch
                    id="reminders"
                    checked={notificationSettings.reminders}
                    onCheckedChange={(checked) => handleUpdateNotificationSetting('reminders', checked)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences de notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select 
                  value={localSettings.themePreference} 
                  onValueChange={(value) => handleUpdateLocalSetting('themePreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Système</SelectItem>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveBasicSettings} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences d'apparence
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Avancés</CardTitle>
              <CardDescription>
                Configuration technique et sauvegarde des données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">État de la synchronisation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Dernière mise à jour:</span>
                      <span className="text-sm text-muted-foreground">
                        {supabaseSettings.updated_at ? 
                          new Date(supabaseSettings.updated_at).toLocaleString('fr-FR') : 
                          'Jamais'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ID des paramètres:</span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {supabaseSettings.id || 'Non défini'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-1">Information</h4>
                  <p className="text-sm text-blue-700">
                    Tous vos paramètres sont automatiquement sauvegardés dans Supabase et 
                    synchronisés en temps réel. Les modifications sont persistantes et 
                    accessibles depuis tous vos appareils.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSettingsPanel;