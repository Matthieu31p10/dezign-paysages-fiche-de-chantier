
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectInfo, Team } from '@/types/models';
import { toast } from 'sonner';

interface SchedulingRulesProps {
  projects: ProjectInfo[];
  teams: Team[];
}

// Types pour les règles de planification
interface ProjectRule {
  projectId: string;
  fixedDays: Record<string, boolean>;
  distributionStrategy: 'even' | 'start' | 'end';
  maxConsecutiveDays: number;
}

const weekDays = [
  { id: 'monday', label: 'Lundi' },
  { id: 'tuesday', label: 'Mardi' },
  { id: 'wednesday', label: 'Mercredi' },
  { id: 'thursday', label: 'Jeudi' },
  { id: 'friday', label: 'Vendredi' },
  { id: 'saturday', label: 'Samedi' },
  { id: 'sunday', label: 'Dimanche' },
];

const SchedulingRules: React.FC<SchedulingRulesProps> = ({ projects, teams }) => {
  const [projectRules, setProjectRules] = useState<ProjectRule[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [fixedDays, setFixedDays] = useState<Record<string, boolean>>({});
  const [distributionStrategy, setDistributionStrategy] = useState<'even' | 'start' | 'end'>('even');
  const [maxConsecutiveDays, setMaxConsecutiveDays] = useState<number>(1);

  const handleAddRule = () => {
    if (!selectedProject) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }
    
    const newRule: ProjectRule = {
      projectId: selectedProject,
      fixedDays,
      distributionStrategy,
      maxConsecutiveDays,
    };
    
    // Vérifier si une règle existe déjà pour ce projet
    const existingRuleIndex = projectRules.findIndex(rule => rule.projectId === selectedProject);
    
    if (existingRuleIndex >= 0) {
      // Mettre à jour la règle existante
      const updatedRules = [...projectRules];
      updatedRules[existingRuleIndex] = newRule;
      setProjectRules(updatedRules);
      toast.success("Règle mise à jour avec succès");
    } else {
      // Ajouter une nouvelle règle
      setProjectRules([...projectRules, newRule]);
      toast.success("Règle ajoutée avec succès");
    }
    
    // Réinitialiser le formulaire
    setSelectedProject('');
    setFixedDays({});
    setDistributionStrategy('even');
    setMaxConsecutiveDays(1);
  };
  
  const handleRemoveRule = (projectId: string) => {
    setProjectRules(projectRules.filter(rule => rule.projectId !== projectId));
    toast.success("Règle supprimée");
  };
  
  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    
    // Si une règle existe déjà pour ce projet, charger ses valeurs
    const existingRule = projectRules.find(rule => rule.projectId === projectId);
    
    if (existingRule) {
      setFixedDays(existingRule.fixedDays);
      setDistributionStrategy(existingRule.distributionStrategy);
      setMaxConsecutiveDays(existingRule.maxConsecutiveDays);
    } else {
      // Sinon réinitialiser le formulaire
      setFixedDays({});
      setDistributionStrategy('even');
      setMaxConsecutiveDays(1);
    }
  };
  
  const handleFixedDayChange = (day: string, checked: boolean) => {
    setFixedDays(prev => ({ ...prev, [day]: checked }));
  };
  
  // Obtenir le nom du projet en fonction de son ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Chantier inconnu";
  };
  
  // Compter le nombre de jours fixes sélectionnés
  const getFixedDaysCount = (days: Record<string, boolean>) => {
    return Object.values(days).filter(Boolean).length;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Définir des règles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Chantier</Label>
            <Select 
              value={selectedProject} 
              onValueChange={handleSelectProject}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Sélectionner un chantier" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Jours fixes</Label>
            <div className="grid grid-cols-2 gap-2">
              {weekDays.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={day.id} 
                    checked={fixedDays[day.id] || false}
                    onCheckedChange={(checked) => 
                      handleFixedDayChange(day.id, checked === true)
                    }
                  />
                  <Label htmlFor={day.id}>{day.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distribution">Stratégie de distribution</Label>
            <Select 
              value={distributionStrategy} 
              onValueChange={(value: 'even' | 'start' | 'end') => setDistributionStrategy(value)}
            >
              <SelectTrigger id="distribution">
                <SelectValue placeholder="Sélectionner une stratégie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="even">Répartition uniforme</SelectItem>
                <SelectItem value="start">Début de mois</SelectItem>
                <SelectItem value="end">Fin de mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxConsecutiveDays">Max. jours consécutifs</Label>
            <Input 
              id="maxConsecutiveDays" 
              type="number" 
              min="1" 
              max="7" 
              value={maxConsecutiveDays}
              onChange={(e) => setMaxConsecutiveDays(Number(e.target.value))}
            />
          </div>
          
          <Button 
            onClick={handleAddRule} 
            className="w-full"
          >
            {projectRules.some(rule => rule.projectId === selectedProject) 
              ? "Mettre à jour la règle" 
              : "Ajouter la règle"
            }
          </Button>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Règles de planification</CardTitle>
        </CardHeader>
        <CardContent>
          {projectRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune règle définie. Utilisez le formulaire pour ajouter des règles de planification.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chantier</TableHead>
                  <TableHead>Jours fixes</TableHead>
                  <TableHead>Distribution</TableHead>
                  <TableHead>Max. jours consécutifs</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectRules.map((rule) => (
                  <TableRow key={rule.projectId}>
                    <TableCell className="font-medium">
                      {getProjectName(rule.projectId)}
                    </TableCell>
                    <TableCell>
                      {getFixedDaysCount(rule.fixedDays) === 0 ? (
                        <span className="text-gray-500">Aucun jour fixe</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {weekDays
                            .filter(day => rule.fixedDays[day.id])
                            .map(day => (
                              <span key={day.id} className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                                {day.label.substring(0, 3)}
                              </span>
                            ))
                          }
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {rule.distributionStrategy === 'even' && "Uniforme"}
                      {rule.distributionStrategy === 'start' && "Début de mois"}
                      {rule.distributionStrategy === 'end' && "Fin de mois"}
                    </TableCell>
                    <TableCell>{rule.maxConsecutiveDays}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveRule(rule.projectId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingRules;
