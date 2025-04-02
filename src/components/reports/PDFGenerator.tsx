
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { FileText, FileOutput } from 'lucide-react';
import ProjectsPDFTab from './pdf/ProjectsPDFTab';
import WorklogsPDFTab from './pdf/WorklogsPDFTab';
import ReportsPDFTab from './pdf/ReportsPDFTab';
import CompanyLogoDisplay from './pdf/CompanyLogoDisplay';

const PDFGenerator = () => {
  const { settings } = useApp();
  const [selectedTab, setSelectedTab] = useState('projects');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileOutput className="h-5 w-5" />
          Générateur de PDF
        </CardTitle>
        <CardDescription>
          Générez des rapports PDF pour vos chantiers et fiches de suivi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyLogoDisplay show={!!settings.companyLogo} />
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Chantiers</span>
            </TabsTrigger>
            <TabsTrigger value="worklogs" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Suivis</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Bilans</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <ProjectsPDFTab />
          </TabsContent>
          
          <TabsContent value="worklogs">
            <WorklogsPDFTab />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsPDFTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PDFGenerator;
