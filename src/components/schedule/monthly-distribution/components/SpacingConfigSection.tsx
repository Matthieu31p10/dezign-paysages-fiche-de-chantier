
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, AlertCircle } from 'lucide-react';
import { PassageSpacingRule } from '../hooks/usePassageSpacing';

interface SpacingConfigSectionProps {
  spacingRules: PassageSpacingRule[];
  projects: any[];
  teams: any[];
  selectedTeam: string;
  getProjectName: (projectId: string) => string;
  getProjectTeam: (projectId: string) => string;
  onUpdateSpacingRule: (projectId: string, updates: Partial<PassageSpacingRule>) => void;
  onGenerateDefaults: () => void;
  onApplySpacing: () => void;
}

const SpacingConfigSection: React.FC<SpacingConfigSectionProps> = ({
  spacingRules,
  projects,
  teams,
  selectedTeam,
  getProjectName,
  getProjectTeam,
  onUpdateSpacingRule,
  onGenerateDefaults,
  onApplySpacing
}) => {
  const filteredRules = spacingRules.filter(rule => {
    if (selectedTeam === 'all') return true;
    const project = projects.find(p => p.id === rule.projectId);
    return project?.team === selectedTeam;
  });

  const hasSpacingRules = spacingRules.length > 0;
  const hasPriorityRules = spacingRules.some(rule => rule.isPriority);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Configuration de l'espacement entre passages
        </CardTitle>
        {hasPriorityRules && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            Des règles d'espacement prioritaires sont actives et modifieront la distribution mensuelle
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasSpacingRules ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Aucune règle d'espacement configurée
            </p>
            <Button onClick={onGenerateDefaults} variant="outline">
              Générer les règles par défaut
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {filteredRules.map((rule) => {
                const project = projects.find(p => p.id === rule.projectId);
                return (
                  <div key={rule.projectId} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{getProjectName(rule.projectId)}</h4>
                        <p className="text-sm text-gray-600">
                          Équipe: {getProjectTeam(rule.projectId)} • 
                          {project?.annualVisits || 0} visites/an
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.isPriority}
                          onCheckedChange={(checked) => 
                            onUpdateSpacingRule(rule.projectId, { isPriority: checked })
                          }
                        />
                        <Label className="text-sm">Prioritaire</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm">Type d'espacement</Label>
                        <Select 
                          value={rule.spacingType} 
                          onValueChange={(value) => 
                            onUpdateSpacingRule(rule.projectId, { 
                              spacingType: value as 'days' | 'weeks' | 'months' 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Jours</SelectItem>
                            <SelectItem value="weeks">Semaines</SelectItem>
                            <SelectItem value="months">Mois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Valeur</Label>
                        <Input
                          type="number"
                          min="1"
                          value={rule.spacingValue}
                          onChange={(e) => 
                            onUpdateSpacingRule(rule.projectId, { 
                              spacingValue: parseInt(e.target.value) || 1 
                            })
                          }
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="text-sm text-gray-600">
                          {rule.spacingType === 'days' && `Tous les ${rule.spacingValue} jour(s)`}
                          {rule.spacingType === 'weeks' && `Toutes les ${rule.spacingValue} semaine(s)`}
                          {rule.spacingType === 'months' && `Tous les ${rule.spacingValue} mois`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onGenerateDefaults}>
                Réinitialiser
              </Button>
              <Button onClick={onApplySpacing} className="bg-blue-600 hover:bg-blue-700">
                Appliquer l'espacement
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpacingConfigSection;
