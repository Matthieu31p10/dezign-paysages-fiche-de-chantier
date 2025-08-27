import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedAnalytics } from './analytics/AdvancedAnalytics';
import { EnhancedForms } from './forms/EnhancedForms';
import { AdvancedSearch } from './search/AdvancedSearch';
import { NotificationCenter } from './notifications/NotificationCenter';

export const Phase3Components: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Phase 3 - Fonctionnalités Avancées</h1>
        <p className="text-muted-foreground">Découvrez les nouvelles fonctionnalités avancées</p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forms">Formulaires</TabsTrigger>
          <TabsTrigger value="search">Recherche</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="forms">
          <EnhancedForms 
            onSubmit={(data) => console.log('Form submitted:', data)}
            showProgress={true}
            multiStep={true}
          />
        </TabsContent>

        <TabsContent value="search">
          <AdvancedSearch 
            onResultSelect={(result) => console.log('Selected:', result)}
            onSearch={(query, filters) => console.log('Search:', query, filters)}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter 
            onNotificationRead={(id) => console.log('Read:', id)}
            onNotificationDelete={(id) => console.log('Delete:', id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};