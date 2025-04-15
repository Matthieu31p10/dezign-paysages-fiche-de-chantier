
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
    return workLogs.filter(log => {
      const isBlankSheet = log.projectId && 
        (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'));
      
      // Check if the year matches the selected year
      const logYear = new Date(log.date).getFullYear();
      const matchesYear = logYear === selectedYear;
      
      return isBlankSheet && matchesYear;
    });
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
  
  // Get all staff members who have worked on blank sheets
  const allStaff = useMemo(() => {
    return Object.keys(personnelStats).sort();
  }, [personnelStats]);
  
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
        invoicedCount={blankSheets.filter(s => s.invoiced).length}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonnelAnalysis personnelStats={personnelStats} />
        <AmountDistribution workLogs={blankSheets} />
      </div>
    </div>
  );
};

export default BlankSheetAnalysis;
