
import { WorkLog } from '@/types/models';
import { formatNumber } from '@/utils/helpers';
import { User } from 'lucide-react';
import StatCard from './StatCard';
import ProgressList from './ProgressList';

interface PersonnelOverviewProps {
  filteredLogs: WorkLog[];
}

interface PersonnelHours {
  name: string;
  hours: number;
}

const PersonnelOverview = ({ filteredLogs }: PersonnelOverviewProps) => {
  // Personnel statistics - extract all unique personnel from work logs
  const personnelHours: PersonnelHours[] = [];
  
  filteredLogs.forEach(log => {
    if (log.personnel && Array.isArray(log.personnel) && log.personnel.length > 0) {
      // Calculate hours per person by dividing the total hours by the number of personnel
      const hoursPerPerson = log.timeTracking.totalHours / log.personnel.length;
      
      log.personnel.forEach(person => {
        const personIndex = personnelHours.findIndex(p => p.name === person);
        if (personIndex >= 0) {
          personnelHours[personIndex].hours += hoursPerPerson;
        } else {
          personnelHours.push({
            name: person,
            hours: hoursPerPerson
          });
        }
      });
    }
  });
  
  // Sort personnel by hours worked (descending)
  const sortedPersonnel = personnelHours.sort((a, b) => b.hours - a.hours);
  const personWithMostHours = sortedPersonnel[0] || { name: '', hours: 0 };
  
  // Calculate total hours worked
  const totalCompletedHours = filteredLogs.reduce((sum, log) => sum + (log.timeTracking?.totalHours || 0), 0);
  
  // Progress list items for personnel
  const personnelProgressItems = sortedPersonnel.map(person => ({
    key: person.name,
    label: person.name,
    value: `${formatNumber(person.hours)} h`,
    progress: Math.min(100, (person.hours / (personWithMostHours.hours || 1)) * 100)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Personnel" 
          value={personnelHours.length}
          subtitle="Membres actifs"
        />
        
        <StatCard 
          title="Heures totales travaillées" 
          value={formatNumber(totalCompletedHours)}
          subtitle="Sur tous les chantiers"
        />
        
        {personWithMostHours && personWithMostHours.hours > 0 && (
          <StatCard 
            title="Membre le plus actif" 
            value={personWithMostHours.name}
            subtitle={`${formatNumber(personWithMostHours.hours)} heures`}
          />
        )}
      </div>
      
      <ProgressList
        title="Heures travaillées par membre"
        icon={<User className="w-5 h-5" />}
        items={personnelProgressItems}
        emptyMessage="Aucune donnée de personnel disponible"
      />
    </div>
  );
};

export default PersonnelOverview;
