
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectInfo, Team } from '@/types/models';
import { toast } from 'sonner';
import { Check, Save, Users } from 'lucide-react';

interface MonthlyDistributionProps {
  projects: ProjectInfo[];
  teams: Team[];
}

type MonthlyRule = {
  projectId: string;
  monthlyVisits: Record<string, number>;
};

// Noms des mois en français
const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const MonthlyDistribution: React.FC<MonthlyDistributionProps> = ({ projects, teams }) => {
  const [monthlyRules, setMonthlyRules] = useState<MonthlyRule[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  
  // Fonction pour générer des règles par défaut basées sur les chantiers
  const generateDefaultRules = () => {
    const rules: MonthlyRule[] = projects.map(project => {
      // Répartir le nombre de visites annuelles sur les 12 mois
      const baseVisitsPerMonth = Math.floor(project.annualVisits / 12);
      const extraVisits = project.annualVisits % 12;
      
      const monthlyVisits: Record<string, number> = {};
      
      months.forEach((_, index) => {
        // Ajouter une visite supplémentaire aux premiers mois jusqu'à épuiser extraVisits
        monthlyVisits[index.toString()] = baseVisitsPerMonth + (index < extraVisits ? 1 : 0);
      });
      
      return {
        projectId: project.id,
        monthlyVisits
      };
    });
    
    setMonthlyRules(rules);
    toast.success("Distribution mensuelle générée");
  };
  
  // Si aucune règle n'existe, générer par défaut
  React.useEffect(() => {
    if (monthlyRules.length === 0 && projects.length > 0) {
      generateDefaultRules();
    }
  }, [projects]);
  
  // Mise à jour de la valeur d'un mois spécifique
  const handleMonthValueChange = (projectId: string, monthIndex: string, value: number) => {
    setMonthlyRules(prevRules => {
      return prevRules.map(rule => {
        if (rule.projectId === projectId) {
          return {
            ...rule,
            monthlyVisits: {
              ...rule.monthlyVisits,
              [monthIndex]: value
            }
          };
        }
        return rule;
      });
    });
  };
  
  // Calcul du total annuel pour un chantier
  const calculateAnnualTotal = (rule: MonthlyRule) => {
    return Object.values(rule.monthlyVisits).reduce((sum, val) => sum + val, 0);
  };
  
  // Sauvegarder les modifications
  const handleSaveChanges = () => {
    toast.success("Distribution mensuelle enregistrée");
    setIsEditing(false);
  };
  
  // Obtenir le nom du chantier
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : "Chantier inconnu";
  };
  
  // Obtenir l'équipe du chantier
  const getProjectTeam = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return "Équipe inconnue";
    
    const team = teams.find(t => t.id === project.team);
    return team ? team.name : "Équipe non assignée";
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Distribution mensuelle des passages
          </CardTitle>
          
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner une équipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les équipes</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredRules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {selectedTeam === 'all' 
              ? "Aucune règle définie. Utilisez le bouton pour générer la distribution par défaut."
              : "Aucun chantier trouvé pour cette équipe."
            }
            {selectedTeam === 'all' && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={generateDefaultRules}
              >
                Générer distribution par défaut
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10 min-w-[200px]">Chantier</TableHead>
                  <TableHead className="sticky left-[200px] bg-white z-10 min-w-[150px]">Équipe</TableHead>
                  {months.map((month, index) => (
                    <TableHead key={month} className="text-center min-w-[80px]">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{month.substring(0, 3)}</span>
                        <span className="text-xs text-gray-500">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[80px]">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.projectId}>
                    <TableCell className="font-medium sticky left-0 bg-white z-10 whitespace-nowrap">
                      {getProjectName(rule.projectId)}
                    </TableCell>
                    <TableCell className="sticky left-[200px] bg-white z-10 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {getProjectTeam(rule.projectId)}
                      </span>
                    </TableCell>
                    {months.map((_, index) => (
                      <TableCell key={index} className="p-1 text-center">
                        {isEditing ? (
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-16 text-center"
                            value={rule.monthlyVisits[index.toString()] || 0}
                            onChange={(e) => handleMonthValueChange(
                              rule.projectId, 
                              index.toString(), 
                              Number(e.target.value)
                            )}
                          />
                        ) : (
                          <span className="font-medium">
                            {rule.monthlyVisits[index.toString()] || 0}
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold bg-gray-50">
                      {calculateAnnualTotal(rule)}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Ligne de totaux si plusieurs projets */}
                {filteredRules.length > 1 && (
                  <TableRow className="bg-blue-50 border-t-2 border-blue-200">
                    <TableCell className="font-bold sticky left-0 bg-blue-50 z-10">
                      TOTAL {selectedTeam === 'all' ? 'GÉNÉRAL' : teams.find(t => t.id === selectedTeam)?.name.toUpperCase()}
                    </TableCell>
                    <TableCell className="sticky left-[200px] bg-blue-50 z-10">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-900">
                        {filteredRules.length} chantier{filteredRules.length > 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    {months.map((_, index) => (
                      <TableCell key={index} className="text-center font-bold text-blue-900">
                        {monthlyTotals[index.toString()]}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold text-blue-900 bg-blue-100">
                      {Object.values(monthlyTotals).reduce((sum, val) => sum + val, 0)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyDistribution;
