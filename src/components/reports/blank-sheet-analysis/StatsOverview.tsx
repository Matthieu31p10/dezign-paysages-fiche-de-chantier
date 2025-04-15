
import React from 'react';
import { WorkLog } from '@/types/models';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPercentage } from '@/utils/format-utils';
import StatCard from './StatCard';
import ProgressBar from './ProgressBar';

interface StatsOverviewProps {
  totalSheets: number;
  totalAmount: number;
  totalHours: number;
  invoicedCount: number;
  workLogs?: WorkLog[];
  selectedYear?: number;
  invoicedSheets?: number;
  uninvoicedSheets?: number;
  invoicedPercentage?: number;
  totalPersonnel?: number;
  avgPersonnelPerSheet?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  workLogs = [],
  selectedYear = new Date().getFullYear(),
  totalSheets,
  invoicedCount,
  totalAmount,
  totalHours,
  invoicedSheets = 0,
  uninvoicedSheets = 0,
  invoicedPercentage = 0,
  totalPersonnel = 0,
  avgPersonnelPerSheet = 0
}) => {
  // Format for display
  const formattedTotalHours = formatNumber(Math.round(totalHours));
  const formattedAvgPersonnel = avgPersonnelPerSheet.toFixed(1);

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
          title="Montant total"
          value={`${formatNumber(totalAmount)}€`}
          description={`${invoicedCount} fiches facturées sur ${totalSheets}`}
        />
        
        <StatCard 
          title="Personnel"
          value={formattedAvgPersonnel || "0"}
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
