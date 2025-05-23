
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProjectInfo, Team } from '@/types/models';
import { toast } from 'sonner';
import { Check, Save } from 'lucide-react';

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
    // Ici, vous pourriez sauvegarder les règles dans une base de données ou localStorage
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Distribution mensuelle des passages</CardTitle>
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
        {monthlyRules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune règle définie. Utilisez le bouton pour générer la distribution par défaut.
            <Button
              variant="outline"
              className="mt-4"
              onClick={generateDefaultRules}
            >
              Générer distribution par défaut
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10">Chantier / Mois</TableHead>
                  <TableHead className="sticky left-44 bg-white z-10">Équipe</TableHead>
                  {months.map((month, index) => (
                    <TableHead key={month} className="text-center min-w-[80px]">{month.substring(0, 3)}</TableHead>
                  ))}
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyRules.map((rule) => (
                  <TableRow key={rule.projectId}>
                    <TableCell className="font-medium sticky left-0 bg-white z-10 whitespace-nowrap">
                      {getProjectName(rule.projectId)}
                    </TableCell>
                    <TableCell className="sticky left-44 bg-white z-10 whitespace-nowrap">
                      {getProjectTeam(rule.projectId)}
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
                          <span>{rule.monthlyVisits[index.toString()] || 0}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium">
                      {calculateAnnualTotal(rule)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyDistribution;
