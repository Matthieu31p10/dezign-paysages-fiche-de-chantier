
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FilePlus } from 'lucide-react';
import { WorkLog } from '@/types/models';
import OriginalBlankWorkSheetForm from '../BlankWorkSheetForm';

interface BlankWorkSheetFormProps {
  editingWorkLogId: string | null;
  getWorkLogById: (id: string) => WorkLog;
  handleFormSuccess: () => void;
}

const BlankWorkSheetForm: React.FC<BlankWorkSheetFormProps> = ({
  editingWorkLogId,
  getWorkLogById,
  handleFormSuccess
}) => {
  return (
    <TabsContent value="new" className="p-0 border-0 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FilePlus className="w-5 h-5 mr-2 text-primary" />
            {editingWorkLogId ? "Modifier la fiche vierge" : "Nouvelle fiche vierge"}
          </CardTitle>
          <CardDescription>
            {editingWorkLogId 
              ? "Modifiez les détails de votre fiche"
              : "Créez une nouvelle fiche pour un travail ponctuel sans lien avec un projet existant, ou pour des travaux complémentaires sur un chantier existant"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OriginalBlankWorkSheetForm 
            initialData={editingWorkLogId ? getWorkLogById(editingWorkLogId) : undefined}
            onSuccess={handleFormSuccess}
            key={editingWorkLogId || 'new'} // Key to force complete reload when editing
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default BlankWorkSheetForm;
