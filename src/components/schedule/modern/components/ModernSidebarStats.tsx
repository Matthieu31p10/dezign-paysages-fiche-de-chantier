
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface MonthStats {
  totalEvents: number;
  totalHours: number;
  totalProjects: number;
  avgHoursPerProject: number;
}

interface ModernSidebarStatsProps {
  monthName: string;
  year: number;
  monthStats: MonthStats;
}

const ModernSidebarStats: React.FC<ModernSidebarStatsProps> = ({
  monthName,
  year,
  monthStats
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="capitalize">{monthName} {year}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{monthStats.totalEvents}</div>
            <div className="text-xs text-blue-600 font-medium">Passages</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{monthStats.totalHours}h</div>
            <div className="text-xs text-green-600 font-medium">Total</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-lg font-semibold text-purple-700">{monthStats.totalProjects}</div>
            <div className="text-xs text-purple-600 font-medium">Chantiers</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-lg font-semibold text-orange-700">{monthStats.avgHoursPerProject}h</div>
            <div className="text-xs text-orange-600 font-medium">Moy/projet</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernSidebarStats;
