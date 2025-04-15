
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProgressBar from './ProgressBar';

interface PersonnelAnalysisProps {
  personnelStats: Record<string, number>;
  topPersonnel?: [string, number][];
  totalPersonnelAssignments?: number;
}

const PersonnelAnalysis = ({ 
  personnelStats,
  topPersonnel = [], 
  totalPersonnelAssignments = 0 
}: PersonnelAnalysisProps) => {
  // If topPersonnel is not provided, calculate it from personnelStats
  const displayPersonnel = topPersonnel.length > 0 ? topPersonnel : 
    Object.entries(personnelStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

  // Calculate total if not provided
  const totalAssignments = totalPersonnelAssignments > 0 ? totalPersonnelAssignments :
    Object.values(personnelStats).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personnel le plus assigné</CardTitle>
      </CardHeader>
      <CardContent>
        {displayPersonnel.length > 0 ? (
          <div className="space-y-4">
            {displayPersonnel.map(([name, count]) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="font-medium">{count} fiches</span>
                </div>
                <ProgressBar 
                  value={totalAssignments > 0 ? (count / totalAssignments) * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonnelAnalysis;
