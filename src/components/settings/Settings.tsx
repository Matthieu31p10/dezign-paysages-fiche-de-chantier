
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SettingsLayout from '@/components/settings/SettingsLayout';
import UserList from '@/components/settings/UserList';
import TeamsManagement from '@/components/settings/TeamsManagement';
import PersonnelManagement from '@/components/settings/PersonnelManagement';
import LogoSettings from '@/components/settings/LogoSettings';
import LoginSettings from '@/components/settings/LoginSettings';
import BackupRestoreSection from '@/components/settings/BackupRestoreSection';
import AccessControl from '@/components/settings/AccessControl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { auth } = useApp();
  const isAdmin = auth.currentUser?.role === 'admin';
  
  const [companyName, setCompanyName] = useState(settings.companyName || '');
  
  const saveCompanyName = () => {
    updateSettings({ companyName });
    toast.success('Nom de l\'entreprise mis à jour');
  };
  
  return (
    <SettingsLayout>
      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginSettings />
            <LogoSettings />
          </CardContent>
        </Card>
        
        <AccessControl isAdmin={isAdmin} />
      </TabsContent>
      
      <TabsContent value="company" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
            <CardDescription>
              Configurez les informations qui apparaîtront sur vos documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company-name" className="text-right">
                Nom de l'entreprise
              </Label>
              <div className="col-span-3 flex space-x-2">
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={saveCompanyName}>Enregistrer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <TeamsManagement />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-6">
        <PersonnelManagement />
        <UserList isAdmin={isAdmin} />
      </TabsContent>
      
      <TabsContent value="data" className="space-y-6">
        <BackupRestoreSection />
      </TabsContent>
    </SettingsLayout>
  );
};

export default Settings;
