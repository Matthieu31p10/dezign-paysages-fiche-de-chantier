
import React from 'react';
import { WorkLog } from '@/types/models';
import { formatNumber, formatPrice } from '@/utils/helpers';
import { FileText, Users, CreditCard, Ban } from 'lucide-react';
import StatCard from './StatCard';
import ProgressBar from './ProgressBar';

interface StatsOverviewProps {
  yearlyBlankSheets: WorkLog[];
  invoicedSheets: WorkLog[];
  nonInvoicedSheets: WorkLog[];
  invoicedAmount: number;
  nonInvoicedAmount: number;
  totalAmount: number;
  personnelCounts: Record<string, number>;
}

const StatsOverview = ({
  yearlyBlankSheets,
  invoicedSheets,
  nonInvoicedSheets,
  invoicedAmount,
  nonInvoicedAmount,
  totalAmount,
  personnelCounts
}: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Fiches vierges"
        value={yearlyBlankSheets.length}
        description="Total des fiches pour l'année sélectionnée"
        icon={FileText}
        iconClassName="text-muted-foreground"
      />
      
      <StatCard
        title="Montant facturé"
        value={formatPrice(invoicedAmount)}
        icon={CreditCard}
        iconClassName="text-green-500"
        description={
          <div className="mt-1">
            <ProgressBar
              label={`${invoicedSheets.length} fiches facturées`}
              value={totalAmount > 0 ? (invoicedAmount / totalAmount) * 100 : 0}
            />
          </div>
        }
      />
      
      <StatCard
        title="Montant non facturé"
        value={formatPrice(nonInvoicedAmount)}
        icon={Ban}
        iconClassName="text-amber-500"
        description={
          <div className="mt-1">
            <ProgressBar
              label={`${nonInvoicedSheets.length} fiches non facturées`}
              value={totalAmount > 0 ? (nonInvoicedAmount / totalAmount) * 100 : 0}
            />
          </div>
        }
      />
      
      <StatCard
        title="Personnel"
        value={Object.keys(personnelCounts).length}
        description="Personnel affecté aux fiches vierges"
        icon={Users}
        iconClassName="text-blue-500"
      />
    </div>
  );
};

export default StatsOverview;
