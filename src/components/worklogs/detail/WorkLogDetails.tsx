
import React from 'react';
import { Separator } from '@/components/ui/separator';
import BasicInfoSection from './sections/BasicInfoSection';
import TimeDeviationSection from './sections/TimeDeviationSection';
import WasteManagementSection from './sections/WasteManagementSection';
import WaterConsumptionSection from './sections/WaterConsumptionSection';
import PersonnelSection from './sections/PersonnelSection';
import TimeTrackingSection from './sections/TimeTrackingSection';
import FinancialSection from './sections/FinancialSection';
import ConsumablesSection from './sections/ConsumablesSection';
import { useWorkLogDetail } from './WorkLogDetailContext';

const WorkLogDetails: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  return (
    <div className="space-y-6">
      <BasicInfoSection />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TimeDeviationSection />
        <WasteManagementSection />
      </div>
      
      <WaterConsumptionSection />
      
      <Separator />
      
      <PersonnelSection />
      
      <Separator />
      
      <TimeTrackingSection />
      
      {/* Sections pour les fiches vierges uniquement */}
      {workLog.signedQuoteAmount > 0 && (
        <>
          <Separator />
          <FinancialSection />
        </>
      )}
      
      {workLog.consumables && workLog.consumables.length > 0 && (
        <>
          <Separator />
          <ConsumablesSection />
        </>
      )}
    </div>
  );
};

export default WorkLogDetails;
