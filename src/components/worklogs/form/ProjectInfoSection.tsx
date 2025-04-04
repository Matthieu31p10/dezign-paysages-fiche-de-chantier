
import React from 'react';
import { useWorkLogForm } from './WorkLogFormContext';
import ProjectInfoCard from './ProjectInfoCard';
import WaterConsumptionSection from './WaterConsumptionSection';

const ProjectInfoSection: React.FC = () => {
  const { selectedProject, timeDeviation, timeDeviationClass } = useWorkLogForm();
  
  if (!selectedProject) return null;
  
  return (
    <>
      <ProjectInfoCard 
        project={selectedProject}
        timeDeviation={timeDeviation}
        timeDeviationClass={timeDeviationClass}
      />
      
      <WaterConsumptionSection />
    </>
  );
};

export default ProjectInfoSection;
