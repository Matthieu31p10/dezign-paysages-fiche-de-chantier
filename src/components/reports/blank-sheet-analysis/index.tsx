
import React from 'react';
import { WorkLog } from '@/types/models';
import { filterWorkLogsByYear } from '@/utils/helpers';
import StatsOverview from './StatsOverview';
import PersonnelAnalysis from './PersonnelAnalysis';
import AmountDistribution from './AmountDistribution';

interface BlankSheetAnalysisProps {
  workLogs: WorkLog[];
  selectedYear: number;
}

const BlankSheetAnalysis: React.FC<BlankSheetAnalysisProps> = ({ 
  workLogs, 
  selectedYear 
}) => {
  // Filtrer seulement les fiches vierges
  const blankSheets = workLogs.filter(log => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
  );
  
  // Filtrer par année
  const yearlyBlankSheets = filterWorkLogsByYear(blankSheets, selectedYear);
  
  // Statistiques de facturation
  const invoicedSheets = yearlyBlankSheets.filter(sheet => sheet.invoiced);
  const nonInvoicedSheets = yearlyBlankSheets.filter(sheet => !sheet.invoiced);
  
  const invoicedAmount = invoicedSheets.reduce((total, sheet) => 
    total + (typeof sheet.signedQuoteAmount === 'number' ? sheet.signedQuoteAmount : 0), 0);
  
  const nonInvoicedAmount = nonInvoicedSheets.reduce((total, sheet) => 
    total + (typeof sheet.signedQuoteAmount === 'number' ? sheet.signedQuoteAmount : 0), 0);
  
  const totalAmount = invoicedAmount + nonInvoicedAmount;
  
  // Statistiques de personnel
  const personnelCounts: Record<string, number> = {};
  
  yearlyBlankSheets.forEach(sheet => {
    if (sheet.personnel && Array.isArray(sheet.personnel)) {
      sheet.personnel.forEach(person => {
        if (typeof person === 'string') {
          personnelCounts[person] = (personnelCounts[person] || 0) + 1;
        }
      });
    }
  });
  
  const topPersonnel = Object.entries(personnelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const totalPersonnelAssignments = Object.values(personnelCounts).reduce((a, b) => a + b, 0);
  
  return (
    <div className="space-y-6">
      <StatsOverview
        yearlyBlankSheets={yearlyBlankSheets}
        invoicedSheets={invoicedSheets}
        nonInvoicedSheets={nonInvoicedSheets}
        invoicedAmount={invoicedAmount}
        nonInvoicedAmount={nonInvoicedAmount}
        totalAmount={totalAmount}
        personnelCounts={personnelCounts}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonnelAnalysis 
          topPersonnel={topPersonnel} 
          totalPersonnelAssignments={totalPersonnelAssignments} 
        />
        
        <AmountDistribution 
          invoicedAmount={invoicedAmount} 
          nonInvoicedAmount={nonInvoicedAmount} 
          totalAmount={totalAmount} 
        />
      </div>
    </div>
  );
};

export default BlankSheetAnalysis;
