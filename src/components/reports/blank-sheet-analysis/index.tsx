
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkLog } from '@/types/models';
import StatsOverview from './StatsOverview';
import PersonnelAnalysis from './PersonnelAnalysis';
import AmountDistribution from './AmountDistribution';
import { getCurrentYear } from '@/utils/date-helpers';

interface BlankSheetAnalysisProps {
  workLogs: WorkLog[];
  selectedYear: number;
}

const BlankSheetAnalysis: React.FC<BlankSheetAnalysisProps> = ({ 
  workLogs, 
  selectedYear = getCurrentYear()
}) => {
  // Filter for blank sheets only and for the selected year
  const blankSheets = useMemo(() => {
    const filtered = workLogs.filter(log => {
      // Use the isBlankWorksheet property instead of projectId check
      const isBlankSheet = log.isBlankWorksheet === true;
      
      // Check if the year matches the selected year
      const logYear = new Date(log.date).getFullYear();
      const matchesYear = logYear === selectedYear;
      
      return isBlankSheet && matchesYear;
    });
    
    
    return filtered;
  }, [workLogs, selectedYear]);
  
  // Calculate total amount from all blank sheets
  const totalAmount = useMemo(() => {
    return blankSheets.reduce((sum, sheet) => {
      // Get total from hourly rate * hours or from signed quote amount
      const sheetAmount = sheet.isQuoteSigned 
        ? (sheet.signedQuoteAmount || 0)
        : (sheet.hourlyRate || 0) * (sheet.timeTracking?.totalHours || 0);
      
      return sum + sheetAmount;
    }, 0);
  }, [blankSheets]);
  
  // Calculate total hours from all blank sheets
  const totalHours = useMemo(() => {
    return blankSheets.reduce((sum, sheet) => {
      return sum + (sheet.timeTracking?.totalHours || 0);
    }, 0);
  }, [blankSheets]);
  
  // Get personnel stats
  const personnelStats = useMemo(() => {
    const personnelCounts: Record<string, number> = {};
    
    blankSheets.forEach(sheet => {
      if (sheet.personnel && Array.isArray(sheet.personnel)) {
        sheet.personnel.forEach(person => {
          if (!personnelCounts[person]) {
            personnelCounts[person] = 0;
          }
          personnelCounts[person]++;
        });
      }
    });
    
    return personnelCounts;
  }, [blankSheets]);
  
  // Calculate top personnel and total assignments
  const topPersonnel = useMemo(() => {
    return Object.entries(personnelStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [personnelStats]);
  
  const totalPersonnelAssignments = useMemo(() => {
    return Object.values(personnelStats).reduce((sum, count) => sum + count, 0);
  }, [personnelStats]);
  
  // Calculate invoiced vs non-invoiced amounts
  const { invoicedAmount, nonInvoicedAmount } = useMemo(() => {
    let invoiced = 0;
    let nonInvoiced = 0;
    
    blankSheets.forEach(sheet => {
      const sheetAmount = sheet.isQuoteSigned 
        ? (sheet.signedQuoteAmount || 0)
        : (sheet.hourlyRate || 0) * (sheet.timeTracking?.totalHours || 0);
      
      if (sheet.invoiced) {
        invoiced += sheetAmount;
      } else {
        nonInvoiced += sheetAmount;
      }
    });
    
    return { invoicedAmount: invoiced, nonInvoicedAmount: nonInvoiced };
  }, [blankSheets]);
  
  // Calculate statistics for StatsOverview
  const invoicedSheets = blankSheets.filter(s => s.invoiced).length;
  const uninvoicedSheets = blankSheets.length - invoicedSheets;
  const invoicedPercentage = blankSheets.length > 0 
    ? Math.round((invoicedSheets / blankSheets.length) * 100) 
    : 0;
  
  // Calculate total personnel and average per sheet
  const totalPersonnel = useMemo(() => Object.keys(personnelStats).length, [personnelStats]);
  const avgPersonnelPerSheet = blankSheets.length > 0 
    ? blankSheets.reduce((sum, sheet) => sum + (sheet.personnel?.length || 0), 0) / blankSheets.length
    : 0;
  
  if (blankSheets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse des fiches vierges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucune fiche vierge pour l'année {selectedYear}.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <StatsOverview 
        totalSheets={blankSheets.length} 
        totalAmount={totalAmount} 
        totalHours={totalHours}
        invoicedCount={invoicedSheets}
        invoicedPercentage={invoicedPercentage}
        // Suppression des props non reconnues
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonnelAnalysis 
          personnelStats={personnelStats} 
          topPersonnel={topPersonnel}
          totalPersonnelAssignments={totalPersonnelAssignments}
        />
        <AmountDistribution 
          workLogs={blankSheets}
          invoicedAmount={invoicedAmount}
          nonInvoicedAmount={nonInvoicedAmount}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  );
};

export default BlankSheetAnalysis;
