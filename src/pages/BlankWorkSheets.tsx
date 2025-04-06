
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const BlankWorkSheets = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fiches Vierges</h1>
        <Button
          onClick={() => navigate('/worklogs')}
        >
          <FilePlus className="w-4 h-4 mr-2" />
          Voir les fiches de suivi
        </Button>
      </div>

      <div className="text-muted-foreground">
        <p>Créez des fiches pour des travaux ponctuels sans lien avec un chantier existant.</p>
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
