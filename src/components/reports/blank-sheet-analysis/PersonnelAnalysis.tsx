
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProgressBar from './ProgressBar';

interface PersonnelAnalysisProps {
  topPersonnel: [string, number][];
  totalPersonnelAssignments: number;
}

const PersonnelAnalysis = ({ 
  topPersonnel, 
  totalPersonnelAssignments 
}: PersonnelAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personnel le plus assigné</CardTitle>
      </CardHeader>
      <CardContent>
        {topPersonnel.length > 0 ? (
          <div className="space-y-4">
            {topPersonnel.map(([name, count]) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="font-medium">{count} fiches</span>
                </div>
                <ProgressBar 
                  value={(count / totalPersonnelAssignments) * 100} 
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
