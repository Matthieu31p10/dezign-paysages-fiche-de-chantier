
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Building2, FileText, CalendarRange } from 'lucide-react';
import ProjectsTab from '@/components/reports/ProjectsTab';
import StatsTab from '@/components/reports/StatsTab';
import ToolsTab from '@/components/reports/ToolsTab';
import YearlyAnalysisTab from '@/components/reports/YearlyAnalysisTab';

const Reports = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-green-800">Bilans</h1>
        <p className="text-muted-foreground">
          Consultez les statistiques et rapports de vos chantiers
        </p>
      </div>
      
      <Tabs defaultValue="projects">
        <TabsList className="grid grid-cols-4 mb-4 bg-green-50">
          <TabsTrigger value="projects" className="flex items-center gap-1.5 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Building2 className="h-4 w-4" />
            <span>Chantiers</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1.5 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <BarChart2 className="h-4 w-4" />
            <span>Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="yearly" className="flex items-center gap-1.5 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <CalendarRange className="h-4 w-4" />
            <span>Analyse annuelle</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1.5 data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            <span>Outils</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          <ProjectsTab />
        </TabsContent>
        
        <TabsContent value="stats">
          <StatsTab />
        </TabsContent>
        
        <TabsContent value="yearly">
          <YearlyAnalysisTab />
        </TabsContent>
        
        <TabsContent value="tools">
          <ToolsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
