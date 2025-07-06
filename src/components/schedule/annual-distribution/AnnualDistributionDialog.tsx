
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar, Save, Building2 } from 'lucide-react';
import { months } from '../monthly-distribution/constants';
import { monthlyDistributionService } from '@/services/monthlyDistributionService';

interface AnnualDistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  teams: any[];
}

const AnnualDistributionDialog: React.FC<AnnualDistributionDialogProps> = ({
  open,
  onOpenChange,
  projects,
  teams
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [monthlyDistribution, setMonthlyDistribution] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const getProjectTeam = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return "Équipe non assignée";
    const team = teams.find(t => t.id === project.team);
    return team ? team.name : "Équipe non assignée";
  };

  const loadProjectDistribution = async (projectId: string) => {
    setIsLoading(true);
    try {
      const distribution = await monthlyDistributionService.getByProjectId(projectId);
      
      if (distribution && Object.keys(distribution.monthlyVisits).length > 0) {
        // Charger la distribution sauvegardée
        setMonthlyDistribution(distribution.monthlyVisits);
        console.log('Distribution chargée depuis la base:', distribution.monthlyVisits);
      } else {
        // Générer une distribution par défaut
        const project = projects.find(p => p.id === projectId);
        if (project) {
          const baseVisitsPerMonth = Math.floor((project.annualVisits || 12) / 12);
          const extraVisits = (project.annualVisits || 12) % 12;
          
          const defaultDistribution: Record<string, number> = {};
          months.forEach((_, index) => {
            defaultDistribution[index.toString()] = baseVisitsPerMonth + (index < extraVisits ? 1 : 0);
          });
          
          setMonthlyDistribution(defaultDistribution);
          console.log('Distribution par défaut générée:', defaultDistribution);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la distribution:', error);
      toast.error('Erreur lors du chargement de la distribution');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    loadProjectDistribution(projectId);
  };

  const handleMonthChange = (monthIndex: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setMonthlyDistribution(prev => ({
      ...prev,
      [monthIndex]: numValue
    }));
  };

  const getTotalPassages = () => {
    return Object.values(monthlyDistribution).reduce((sum, val) => sum + val, 0);
  };

  const handleSave = async () => {
    if (!selectedProject) {
      toast.error("Veuillez sélectionner un chantier");
      return;
    }

    setIsSaving(true);
    try {
      await monthlyDistributionService.saveDistribution(selectedProject.id, monthlyDistribution);
      
      const total = getTotalPassages();
      toast.success(`Distribution sauvegardée pour ${selectedProject.name} (${total} passages/an)`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la distribution');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const baseVisitsPerMonth = Math.floor((project.annualVisits || 12) / 12);
        const extraVisits = (project.annualVisits || 12) % 12;
        
        const distribution: Record<string, number> = {};
        months.forEach((_, index) => {
          distribution[index.toString()] = baseVisitsPerMonth + (index < extraVisits ? 1 : 0);
        });
        
        setMonthlyDistribution(distribution);
        toast.info("Distribution réinitialisée");
      }
    }
  };

  // Réinitialiser quand le dialogue se ferme
  useEffect(() => {
    if (!open) {
      setSelectedProjectId('');
      setMonthlyDistribution({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Distribution annuelle des passages
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection du chantier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Sélection du chantier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-select">Chantier</Label>
                  <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
                    <SelectTrigger id="project-select">
                      <SelectValue placeholder="Sélectionner un chantier" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{project.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {getProjectTeam(project.id)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProject && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm">
                      <div><strong>Chantier :</strong> {selectedProject.name}</div>
                      <div><strong>Équipe :</strong> {getProjectTeam(selectedProject.id)}</div>
                      <div><strong>Passages annuels prévus :</strong> {selectedProject.annualVisits || 12}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration mensuelle */}
          {selectedProject && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Répartition mensuelle
                  {isLoading && <span className="text-sm text-gray-500 ml-2">(Chargement...)</span>}
                </CardTitle>
                <div className="text-sm text-gray-600">
                  Définissez le nombre de passages pour chaque mois de l'année
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {months.map((month, index) => (
                      <div key={month} className="space-y-2">
                        <Label htmlFor={`month-${index}`} className="text-sm font-medium">
                          {month}
                        </Label>
                        <Input
                          id={`month-${index}`}
                          type="number"
                          min="0"
                          value={monthlyDistribution[index.toString()] || 0}
                          onChange={(e) => handleMonthChange(index.toString(), e.target.value)}
                          className="text-center"
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium">Total passages annuels : </span>
                      <span className={`font-bold ${getTotalPassages() === (selectedProject.annualVisits || 12) ? 'text-green-600' : 'text-orange-600'}`}>
                        {getTotalPassages()}
                      </span>
                      <span className="text-gray-500 ml-1">
                        / {selectedProject.annualVisits || 12} prévus
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!selectedProject || isSaving || isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnualDistributionDialog;
