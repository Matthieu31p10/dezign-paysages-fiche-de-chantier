
import React from 'react';
import { useWorkLogForm } from './WorkLogFormContext';
import ProjectInfoCard from './ProjectInfoCard';
import WaterConsumptionSection from './WaterConsumptionSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectInfoSection: React.FC = () => {
  const { selectedProject, timeDeviation, timeDeviationClass } = useWorkLogForm();
  
  if (!selectedProject) return null;
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Informations du chantier</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectInfoCard 
            project={selectedProject}
            timeDeviation={timeDeviation}
            timeDeviationClass={timeDeviationClass}
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Consommation d'eau</CardTitle>
        </CardHeader>
        <CardContent>
          <WaterConsumptionSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectInfoSection;
