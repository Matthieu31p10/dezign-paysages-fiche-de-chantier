
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ProjectInfo, Team } from '@/types/models';
import { useMonthlyRules } from './monthly-distribution/hooks/useMonthlyRules';
import { useProjectHelpers } from './monthly-distribution/hooks/useProjectHelpers';
import DistributionHeader from './monthly-distribution/components/DistributionHeader';
import DistributionTable from './monthly-distribution/components/DistributionTable';
import EmptyState from './monthly-distribution/components/EmptyState';
import { months } from './monthly-distribution/constants';
import { MonthlyDistributionProps } from './monthly-distribution/types';

const MonthlyDistribution: React.FC<MonthlyDistributionProps> = ({ projects, teams }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  
  const {
    monthlyRules,
    generateDefaultRules,
    handleMonthValueChange,
    calculateAnnualTotal
  } = useMonthlyRules(projects);

  const { getProjectName, getProjectTeam } = useProjectHelpers(projects, teams);

  // Sauvegarder les modifications
  const handleSaveChanges = () => {
    toast.success("Distribution mensuelle enregistrée");
    setIsEditing(false);
  };

  // Filtrer les projets par équipe sélectionnée
  const filteredRules = monthlyRules.filter(rule => {
    if (selectedTeam === 'all') return true;
    const project = projects.find(p => p.id === rule.projectId);
    return project?.team === selectedTeam;
  });

  // Calcul des totaux par mois pour l'équipe sélectionnée
  const calculateMonthlyTotals = () => {
    const totals: Record<string, number> = {};
    months.forEach((_, index) => {
      totals[index.toString()] = filteredRules.reduce((sum, rule) => {
        return sum + (rule.monthlyVisits[index.toString()] || 0);
      }, 0);
    });
    return totals;
  };

  const monthlyTotals = calculateMonthlyTotals();
  
  return (
    <Card>
      <DistributionHeader
        selectedTeam={selectedTeam}
        teams={teams}
        isEditing={isEditing}
        onTeamChange={setSelectedTeam}
        onEditToggle={() => setIsEditing(!isEditing)}
        onSave={handleSaveChanges}
      />
      <CardContent>
        {filteredRules.length === 0 ? (
          <EmptyState
            selectedTeam={selectedTeam}
            onGenerateDefault={generateDefaultRules}
          />
        ) : (
          <DistributionTable
            filteredRules={filteredRules}
            isEditing={isEditing}
            getProjectName={getProjectName}
            getProjectTeam={getProjectTeam}
            calculateAnnualTotal={calculateAnnualTotal}
            handleMonthValueChange={handleMonthValueChange}
            monthlyTotals={monthlyTotals}
            selectedTeam={selectedTeam}
            teams={teams}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyDistribution;
