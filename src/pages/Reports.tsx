
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Building2, FileText, CalendarRange } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/utils/date';
import ProjectsTab from '@/components/reports/ProjectsTab';
import StatsTab from '@/components/reports/StatsTab';
import ToolsTab from '@/components/reports/ToolsTab';
import YearlyAnalysisTab from '@/components/reports/YearlyAnalysisTab';
import ReportsHeader from '@/components/reports/ReportsHeader';

const Reports = () => {
  const { projectInfos, workLogs } = useApp();
  
  const activeProjects = projectInfos?.filter(p => !p.isArchived) || [];
  const totalWorkLogs = workLogs?.length || 0;
  const currentPeriod = formatDate(new Date());

  return (
    <div className="space-y-6 animate-fade-in p-1">
      <ReportsHeader 
        totalProjects={activeProjects.length}
        totalWorkLogs={totalWorkLogs}
        currentPeriod={currentPeriod}
      />
      
      <Tabs defaultValue="projects">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-gradient-to-r from-accent/5 to-muted/30 border border-border/50 shadow-sm">
          <TabsTrigger 
            value="projects" 
            className="group flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 hover:bg-primary/10"
          >
            <Building2 className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Chantiers</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="group flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2.5 data-[state=active]:bg-chart-1 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-chart-1/10"
          >
            <BarChart2 className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Statistiques</span>
          </TabsTrigger>
          <TabsTrigger 
            value="yearly" 
            className="group flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2.5 data-[state=active]:bg-chart-2 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-chart-2/10"
          >
            <CalendarRange className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Analyse</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tools" 
            className="group flex flex-col sm:flex-row items-center gap-1.5 px-3 py-2.5 data-[state=active]:bg-chart-3 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 hover:bg-chart-3/10"
          >
            <FileText className="h-4 w-4 group-data-[state=active]:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Outils</span>
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
