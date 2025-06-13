
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { Card } from '@/components/ui/card';
import BlankWorkSheetForm from '@/components/worksheets/BlankWorkSheetForm';
import { toast } from 'sonner';

const BlankWorkSheetNew = () => {
  const navigate = useNavigate();
  const { projectInfos } = useApp();
  const { workLogs } = useWorkLogs();
  
  const handleReturn = () => {
    navigate('/blank-worksheets', { replace: false });
  };
  
  const handleSuccess = () => {
    toast.success("Fiche vierge créée avec succès");
    console.log("Blank worksheet form submitted successfully, navigating to /blank-worksheets");
    navigate('/blank-worksheets', { replace: true });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
            onClick={handleReturn}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold text-blue-800">Nouvelle fiche vierge</h1>
        </div>
      </div>
      
      <Card className="p-6 border-blue-200 shadow-md bg-gradient-to-br from-white to-blue-50">
        <BlankWorkSheetForm 
          onSuccess={handleSuccess}
          projectInfos={projectInfos}
          existingWorkLogs={workLogs}
          isBlankWorksheet={true}
        />
      </Card>
    </div>
  );
};

export default BlankWorkSheetNew;
