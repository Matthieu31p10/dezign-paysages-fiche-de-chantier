
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { useProjectHelpers } from './monthly-distribution/hooks/useProjectHelpers';
import { useEnhancedMonthlyRules } from './monthly-distribution/hooks/useEnhancedMonthlyRules';
import DistributionHeader from './monthly-distribution/components/DistributionHeader';
import DistributionTable from './monthly-distribution/components/DistributionTable';
import SpacingConfigSection from './monthly-distribution/components/SpacingConfigSection';
import EmptyState from './monthly-distribution/components/EmptyState';
import { MonthlyDistributionProps } from './monthly-distribution/types';

const MonthlyDistribution: React.FC<MonthlyDistributionProps> = ({ projects, teams }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  
  const {
    monthlyRules,
    spacingRules,
    showSpacingConfig,
    setShowSpacingConfig,
    generateDefaultRules,
    generateDefaultSpacingRules,
    updateSpacingRule,
    applySpacingToDistribution,
    handleMonthValueChange,
    calculateAnnualTotal
  } = useEnhancedMonthlyRules(projects);

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
    Array.from({ length: 12 }, (_, index) => {
      totals[index.toString()] = filteredRules.reduce((sum, rule) => {
        return sum + (rule.monthlyVisits[index.toString()] || 0);
      }, 0);
    });
    return totals;
  };

  const monthlyTotals = calculateMonthlyTotals();
  
  return (
    <div className="space-y-6">
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
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Gérez la répartition mensuelle des passages et configurez l'espacement prioritaire
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSpacingConfig(!showSpacingConfig)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {showSpacingConfig ? 'Masquer' : 'Configurer'} l'espacement
            </Button>
          </div>

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

      {showSpacingConfig && (
        <SpacingConfigSection
          spacingRules={spacingRules}
          projects={projects}
          teams={teams}
          selectedTeam={selectedTeam}
          getProjectName={getProjectName}
          getProjectTeam={getProjectTeam}
          onUpdateSpacingRule={updateSpacingRule}
          onGenerateDefaults={generateDefaultSpacingRules}
          onApplySpacing={applySpacingToDistribution}
        />
      )}
    </div>
  );
};

export default MonthlyDistribution;
