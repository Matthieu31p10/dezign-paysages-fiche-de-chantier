
import { Control } from 'react-hook-form';
import { BlankWorkSheetValues } from '../../schema';
import { IndividualHoursField } from './IndividualHoursField';
import { TeamHoursDisplay } from './TeamHoursDisplay';
import { HourlyRateField } from './HourlyRateField';

interface TimeCalculationsProps {
  control: Control<BlankWorkSheetValues>;
  totalHours: number;
  personnelCount: number;
  totalTeamHours: number;
}

export const TimeCalculations = ({ 
  control, 
  totalHours, 
  personnelCount, 
  totalTeamHours 
}: TimeCalculationsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
      <IndividualHoursField control={control} totalHours={totalHours} />
      <TeamHoursDisplay totalTeamHours={totalTeamHours} personnelCount={personnelCount} />
      <HourlyRateField control={control} />
    </div>
  );
};
