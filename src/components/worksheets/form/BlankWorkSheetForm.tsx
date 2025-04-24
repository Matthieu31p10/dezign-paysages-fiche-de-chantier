
import React, { useEffect } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FilePlus, Loader2 } from 'lucide-react';
import { WorkLog } from '@/types/models';
import OriginalBlankWorkSheetForm from '../BlankWorkSheetForm';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [workLogData, setWorkLogData] = React.useState<WorkLog | undefined>(undefined);

  // Fetch work log data if editing
  useEffect(() => {
    if (editingWorkLogId) {
      try {
        const data = getWorkLogById(editingWorkLogId);
        setWorkLogData(data);
      } catch (error) {
        console.error("Error fetching work log:", error);
        toast.error("Erreur lors du chargement de la fiche");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [editingWorkLogId, getWorkLogById]);

  return (
    <TabsContent value="new" className="p-0 border-0 mt-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-white">
          <CardTitle className="text-xl flex items-center text-green-800">
            <FilePlus className="w-5 h-5 mr-2 text-green-600" />
            {editingWorkLogId ? "Modifier la fiche vierge" : "Nouvelle fiche vierge"}
          </CardTitle>
          <CardDescription>
            {editingWorkLogId 
              ? "Modifiez les détails de votre fiche"
              : "Créez une nouvelle fiche pour un travail ponctuel sans lien avec un projet existant, ou pour des travaux complémentaires sur un chantier existant"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement...</span>
            </div>
          ) : (
            <OriginalBlankWorkSheetForm 
              initialData={workLogData}
              onSuccess={handleFormSuccess}
              key={editingWorkLogId || 'new'} // Key to force complete reload when editing
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default BlankWorkSheetForm;
