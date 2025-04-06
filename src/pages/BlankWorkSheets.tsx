
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, ArrowLeft } from 'lucide-react';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const BlankWorkSheets = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fiches Vierges</h1>
          <p className="text-muted-foreground">
            Créez des fiches pour des travaux ponctuels sans lien avec un chantier existant
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/worklogs')}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voir les fiches de suivi
        </Button>
      </div>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">Nouvelle fiche vierge</TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="p-0 border-0 mt-6">
          <Card className="p-6">
            <BlankWorkSheetForm 
              onSuccess={() => {
                toast.success("Fiche créée avec succès");
                navigate('/worklogs');
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlankWorkSheets;
