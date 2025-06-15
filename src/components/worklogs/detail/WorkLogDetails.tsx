
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useWorkLogDetail } from './WorkLogDetailContext';

// Import sections
import WorkLogSummarySection from './sections/WorkLogSummarySection';
import BasicInfoSection from './sections/BasicInfoSection';
import PersonnelSection from './sections/PersonnelSection';
import TimeTrackingSection from './sections/TimeTrackingSection';
import TasksSection from './sections/TasksSection';
import WaterConsumptionSection from './sections/WaterConsumptionSection';
import TimeDeviationSection from './sections/TimeDeviationSection';

const WorkLogDetails: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  if (!workLog) {
    return <div>Aucune donnée disponible</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Section - Always shown first */}
      <WorkLogSummarySection />
      
      <Separator />
      
      {/* Basic Information */}
      <BasicInfoSection />
      
      <Separator />
      
      {/* Personnel Section */}
      {workLog.personnel && workLog.personnel.length > 0 && (
        <>
          <PersonnelSection />
          <Separator />
        </>
      )}
      
      {/* Time Tracking Section */}
      <TimeTrackingSection />
      
      <Separator />
      
      {/* Time Deviation Section */}
      <TimeDeviationSection />
      
      <Separator />
      
      {/* Tasks Section */}
      <TasksSection />
      
      {/* Water Consumption Section */}
      {workLog.waterConsumption !== undefined && workLog.waterConsumption > 0 && (
        <>
          <Separator />
          <WaterConsumptionSection />
        </>
      )}
    </div>
  );
};

export default WorkLogDetails;
