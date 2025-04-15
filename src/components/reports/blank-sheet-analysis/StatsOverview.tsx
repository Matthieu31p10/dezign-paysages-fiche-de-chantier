
import React from 'react';
import { WorkLog } from '@/types/models';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Ban } from 'lucide-react';
import { formatNumber, formatPercentage } from '@/utils/format-utils';
import StatCard from './StatCard';
import ProgressBar from './ProgressBar';

interface StatsOverviewProps {
  workLogs: WorkLog[];
  selectedYear: number;
  totalSheets: number;
  invoicedSheets: number;
  uninvoicedSheets: number;
  invoicedPercentage: number;
  totalPersonnel: number;
  avgPersonnelPerSheet: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  workLogs,
  selectedYear,
  totalSheets,
  invoicedSheets,
  uninvoicedSheets,
  invoicedPercentage,
  totalPersonnel,
  avgPersonnelPerSheet
}) => {
  // Calculate total hours spent across all blank sheets
  const totalHours = workLogs.reduce((sum, log) => {
    return sum + (log.timeTracking?.totalHours || 0);
  }, 0);

  // Format for display
  const formattedTotalHours = formatNumber(Math.round(totalHours));
  const formattedAvgPersonnel = avgPersonnelPerSheet.toFixed(1);

  // Determine trend icons (these would ideally be calculated based on historical data)
  const invoicedTrend = (
    <span className="inline-flex items-center text-green-600">
      <ArrowUp className="w-3 h-3 mr-1" />
      <span>+5%</span>
    </span>
  );

  const uninvoicedTrend = (
    <span className="inline-flex items-center text-red-600">
      <ArrowDown className="w-3 h-3 mr-1" />
      <span>-2%</span>
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Fiches vierges" 
          value={totalSheets} 
          description={`Total des fiches en ${selectedYear}`}
        />
        
        <StatCard 
          title="Heures travaillées"
          value={formattedTotalHours}
          description="Nombre total d'heures"
        />
        
        <StatCard 
          title="Facturation"
          value={`${invoicedPercentage}%`}
          description={`${invoicedSheets} fiches facturées sur ${totalSheets}`}
        />
        
        <StatCard 
          title="Personnel"
          value={formattedAvgPersonnel}
          description={`${totalPersonnel} personnes au total`}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">État de facturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressBar 
            value={invoicedPercentage} 
            label="Facturées" 
            count={invoicedSheets}
            total={totalSheets}
            className="h-2 mt-1 bg-muted"
          />
          
          <ProgressBar 
            value={100 - invoicedPercentage} 
            label="Non facturées" 
            count={uninvoicedSheets}
            total={totalSheets}
            className="h-2 mt-1 bg-muted"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
