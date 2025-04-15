
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Euro, Clock, FileCheck } from 'lucide-react';
import StatCard from './StatCard';

interface StatsOverviewProps {
  totalSheets: number;
  totalAmount: number;
  totalHours: number;
  invoicedCount: number;
  workLogs?: any[];
  selectedYear?: number;
  invoicedSheets?: number;
  uninvoicedSheets?: number;
  invoicedPercentage?: number;
  totalPersonnel?: number;
  avgPersonnelPerSheet?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalSheets,
  totalAmount,
  totalHours,
  invoicedCount,
  invoicedPercentage: providedInvoicedPercentage,
  // Autres props optionnelles
}) => {
  // Calculer le pourcentage si non fourni
  const invoicedPercentage = providedInvoicedPercentage !== undefined 
    ? providedInvoicedPercentage 
    : (totalSheets > 0 ? Math.round((invoicedCount / totalSheets) * 100) : 0);

  const averageAmount = totalSheets > 0
    ? totalAmount / totalSheets
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        title="Total des fiches"
        value={totalSheets.toString()}
        description="Nombre total de fiches vierges"
        icon={<FileText className="h-8 w-8 text-primary" />}
      />
      
      <StatCard
        title="Montant total"
        value={`${Math.round(totalAmount).toLocaleString()} €`}
        description={`Moyenne de ${Math.round(averageAmount).toLocaleString()} € par fiche`}
        icon={<Euro className="h-8 w-8 text-primary" />}
      />
      
      <StatCard
        title="Heures totales"
        value={totalHours.toFixed(1)}
        description={`Moyenne de ${(totalSheets > 0 ? totalHours / totalSheets : 0).toFixed(1)} heures par fiche`}
        icon={<Clock className="h-8 w-8 text-primary" />}
      />
      
      <StatCard
        title="Fiches facturées"
        value={`${invoicedCount} (${invoicedPercentage}%)`}
        description={`${totalSheets - invoicedCount} fiches non facturées`}
        icon={<FileCheck className="h-8 w-8 text-primary" />}
      />
    </div>
  );
};

export default StatsOverview;
