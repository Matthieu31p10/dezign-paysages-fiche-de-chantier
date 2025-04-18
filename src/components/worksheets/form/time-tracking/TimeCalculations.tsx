
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
  // S'assurer que les valeurs sont bien des nombres
  const safeHours = typeof totalHours === 'number' ? totalHours : 0;
  const safeTeamHours = typeof totalTeamHours === 'number' ? totalTeamHours : 0;
  const safePersonnelCount = typeof personnelCount === 'number' ? personnelCount : 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
      <IndividualHoursField control={control} totalHours={safeHours} />
      <TeamHoursDisplay totalTeamHours={safeTeamHours} personnelCount={safePersonnelCount} />
      <HourlyRateField control={control} />
    </div>
  );
};
