
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Droplets, DropletIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getYearsFromWorkLogs, filterWorkLogsByYear } from '@/utils/statistics';
import { WorkLog, ProjectInfo } from '@/types/models';
import { formatDate } from '@/utils/date';

interface WaterByProject {
  projectId: string;
  projectName: string;
  totalConsumption: number;
  visits: number;
  lastReading?: {
    date: Date;
    value: number;
  };
}

const WaterConsumptionReport = () => {
  const { workLogs, projectInfos } = useApp();
  const years = getYearsFromWorkLogs(workLogs);
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  
  const filteredLogs = useMemo(() => 
    filterWorkLogsByYear(workLogs, selectedYear), 
    [workLogs, selectedYear]
  );
  
  const waterConsumptionByProject = useMemo(() => {
    // Get projects with irrigation
    const irrigationProjects = projectInfos.filter(p => 
      p.irrigation === 'irrigation' && !p.isArchived
    );
    
    // Initialize data structure
    const projectsData: Record<string, WaterByProject> = {};
    
    irrigationProjects.forEach(project => {
      projectsData[project.id] = {
        projectId: project.id,
        projectName: project.name,
        totalConsumption: 0,
        visits: 0
      };
    });
    
    // Calculate stats
    filteredLogs.forEach(log => {
      if (log.waterConsumption !== undefined && log.waterConsumption !== null) {
        if (projectsData[log.projectId]) {
          projectsData[log.projectId].totalConsumption += log.waterConsumption;
          projectsData[log.projectId].visits += 1;
          
          // Track last reading
          const logDate = new Date(log.date);
          if (!projectsData[log.projectId].lastReading || 
              logDate > new Date(projectsData[log.projectId].lastReading!.date)) {
            projectsData[log.projectId].lastReading = {
              date: logDate,
              value: log.waterConsumption
            };
          }
        }
      }
    });
    
    // Convert to array and sort by consumption
    return Object.values(projectsData)
      .sort((a, b) => b.totalConsumption - a.totalConsumption);
      
  }, [filteredLogs, projectInfos]);
  
  const totalAnnualConsumption = useMemo(() => 
    waterConsumptionByProject.reduce((sum, project) => sum + project.totalConsumption, 0),
    [waterConsumptionByProject]
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Droplets className="h-5 w-5 mr-2 text-blue-500" />
              Consommation d'eau
            </CardTitle>
            <CardDescription>
              Suivi de la consommation d'eau par chantier
            </CardDescription>
          </div>
          
          <div className="flex items-center">
            <Label htmlFor="year-select" className="mr-2">Année:</Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger id="year-select" className="w-[100px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-blue-600">{totalAnnualConsumption.toFixed(1)} m³</div>
          <div className="text-sm text-muted-foreground">Consommation totale {selectedYear}</div>
        </div>
        
        {waterConsumptionByProject.length > 0 ? (
          <div className="space-y-4">
            {waterConsumptionByProject.map(project => (
              <div key={project.projectId} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{project.projectName}</h3>
                  <span className="font-semibold text-blue-600">{project.totalConsumption.toFixed(1)} m³</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <DropletIcon className="h-3 w-3 mr-1" />
                    {project.visits} relevés
                  </div>
                  
                  {project.lastReading && (
                    <div className="text-right">
                      Dernier: {project.lastReading.value.toFixed(1)} m³ 
                      ({formatDate(project.lastReading.date)})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucune donnée de consommation d'eau disponible pour {selectedYear}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterConsumptionReport;
