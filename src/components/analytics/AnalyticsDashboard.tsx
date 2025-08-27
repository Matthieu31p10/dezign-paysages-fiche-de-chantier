import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  FileBarChart,
  Calendar as CalendarIcon
} from 'lucide-react';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import PerformanceFlowChart from './PerformanceFlowChart';
import AdvancedReports from './AdvancedReports';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Tableau de bord complet avec métriques, performances et rapports
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3" />
            Temps réel
          </Badge>
          <Badge variant="outline" className="gap-1">
            <CalendarIcon className="h-3 w-3" />
            Mise à jour: il y a 2 min
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileBarChart className="h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceFlowChart />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <AdvancedReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;