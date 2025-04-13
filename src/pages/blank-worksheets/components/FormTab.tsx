
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePlus } from 'lucide-react';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import { WorkLog } from '@/types/models';

interface FormTabProps {
  editingWorkLogId: string | null;
  getWorkLogById: (id: string) => WorkLog | undefined;
  onSuccess: () => void;
}

const FormTab: React.FC<FormTabProps> = ({ 
  editingWorkLogId, 
  getWorkLogById, 
  onSuccess 
}) => {
  return (
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
        <BlankWorkSheetForm 
          initialData={editingWorkLogId ? getWorkLogById(editingWorkLogId) : undefined}
          onSuccess={onSuccess}
          key={editingWorkLogId || 'new'} // Add key to force component reload on edit
        />
      </CardContent>
    </Card>
  );
};

export default FormTab;
