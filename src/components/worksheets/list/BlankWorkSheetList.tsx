
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { WorkLog } from '@/types/models';
import EmptyBlankWorkSheetState from '../EmptyBlankWorkSheetState';
import BlankSheetItem from './blank-sheet-item';
import { useProjects } from '@/context/ProjectsContext';

interface BlankWorkSheetListProps {
  activeTab: string;
  blankWorkSheets: WorkLog[];
  handleCreateNew: () => void;
  handleEditWorksheet: (id: string) => void;
  handleExportPDF: (id: string) => void;
  handlePrint: (id: string) => void;
}

const BlankWorkSheetList: React.FC<BlankWorkSheetListProps> = ({
  activeTab,
  blankWorkSheets,
  handleCreateNew,
  handleEditWorksheet,
  handleExportPDF,
  handlePrint
}) => {
  const { getProjectById } = useProjects();
  
  if (activeTab !== 'list') {
    return null;
  }
  
  return (
    <TabsContent value="list" className="p-0 border-0 mt-6">
      {blankWorkSheets.length === 0 ? (
        <EmptyBlankWorkSheetState onCreateNew={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blankWorkSheets.map((sheet) => (
            <BlankSheetItem
              key={sheet.id}
              sheet={sheet}
              linkedProject={sheet.notes ? getProjectById(sheet.notes) : null}
              onEdit={handleEditWorksheet}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
            />
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default BlankWorkSheetList;
