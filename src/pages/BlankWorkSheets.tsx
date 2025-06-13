
import React from 'react';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import BlankWorkSheetList from '@/components/worksheets/BlankWorkSheetList';
import { useNavigate } from 'react-router-dom';

const BlankWorkSheets: React.FC = () => {
  const { workLogs, isLoading } = useWorkLogs();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleCreateNew = () => {
    navigate('/blank-worksheets/new');
  };

  const handleEdit = (workLogId: string) => {
    navigate(`/worklogs/${workLogId}/edit`);
  };

  const handleExportPDF = async (id: string) => {
    // Implementation for PDF export
    console.log('Exporting PDF for worksheet:', id);
  };

  const handlePrint = async (id: string) => {
    // Implementation for printing
    console.log('Printing worksheet:', id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BlankWorkSheetList
        sheets={workLogs}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default BlankWorkSheets;
