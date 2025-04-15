
import React from 'react';
import { WorkLog } from '@/types/models';
import BlankSheetAnalysisComponent from './blank-sheet-analysis';

interface BlankSheetAnalysisProps {
  workLogs: WorkLog[];
  selectedYear: number;
}

// This is just a wrapper component for backward compatibility
const BlankSheetAnalysis: React.FC<BlankSheetAnalysisProps> = ({ 
  workLogs, 
  selectedYear 
}) => {
  return <BlankSheetAnalysisComponent workLogs={workLogs} selectedYear={selectedYear} />;
};

export default BlankSheetAnalysis;
