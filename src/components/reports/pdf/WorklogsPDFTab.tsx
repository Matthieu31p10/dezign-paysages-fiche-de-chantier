
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegularWorklogsTab from './components/RegularWorklogsTab';
import BlankWorksheetsTab from './components/BlankWorksheetsTab';
import { usePDFGenerator } from './hooks/usePDFGenerator';

const WorklogsPDFTab = () => {
  const {
    activeTab,
    setActiveTab,
    selectedWorkLogId,
    setSelectedWorkLogId,
    selectedBlankWorkLogId,
    setSelectedBlankWorkLogId,
    pdfOptions,
    handleOptionChange,
    handleGenerateWorkLogPDF
  } = usePDFGenerator();
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">Fiches de suivi</TabsTrigger>
          <TabsTrigger value="blank">Fiches vierges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular" className="space-y-4 pt-4">
          <RegularWorklogsTab
            selectedWorkLogId={selectedWorkLogId}
            setSelectedWorkLogId={setSelectedWorkLogId}
            pdfOptions={pdfOptions}
            handleOptionChange={handleOptionChange}
            handleGeneratePDF={() => handleGenerateWorkLogPDF(false)}
          />
        </TabsContent>
        
        <TabsContent value="blank" className="space-y-4 pt-4">
          <BlankWorksheetsTab 
            selectedWorkLogId={selectedBlankWorkLogId}
            setSelectedWorkLogId={setSelectedBlankWorkLogId}
            pdfOptions={pdfOptions}
            handleOptionChange={handleOptionChange}
            handleGeneratePDF={() => handleGenerateWorkLogPDF(true)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorklogsPDFTab;
