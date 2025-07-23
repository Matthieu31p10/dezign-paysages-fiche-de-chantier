import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Building2 } from 'lucide-react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog, ProjectInfo } from '@/types/models';
import { useProjectPrimaryTeams } from '@/hooks/useProjectPrimaryTeams';
import { Team } from '@/types/models';
import { filterProjectsByTeam, filterWorkLogsByTeam, isTeamMatch, getTeamById } from '@/utils/teamUtils';

interface ProjectHistoryTableProps {
  workLogs: WorkLog[];
  projectInfos: ProjectInfo[];
  teams: Team[];
  selectedTeam: string;
}

interface ProjectHistoryRow {
  projectId: string;
  projectName: string;
  lastPassageDate: Date | null;
  daysSinceLastPassage: number | null;
  totalPassages: number;
  lastPassageTeam: string | null;
  primaryTeam: string | null;
}

export const ProjectHistoryTable: React.FC<ProjectHistoryTableProps> = ({
  workLogs,
  projectInfos,
  teams,
  selectedTeam
}) => {
  const { getPrimaryTeamForProject } = useProjectPrimaryTeams();
  
  const projectHistory = useMemo(() => {
    // Obtenir tous les projets actifs
    const activeProjects = projectInfos.filter(p => !p.isArchived);
    
    // Filtrer les projets par équipe responsable (équipe principale) si une équipe est sélectionnée
    const projectsToShow = selectedTeam && selectedTeam !== 'all' 
      ? activeProjects.filter(project => {
          const primaryTeam = getTeamById(teams, project.team);
          return isTeamMatch(primaryTeam, selectedTeam);
        })
      : activeProjects;
    
    const history: ProjectHistoryRow[] = projectsToShow.map(project => {
      // Filtrer les work logs pour ce projet (exclure les blank worksheets)
      let projectWorkLogs = workLogs.filter(log => 
        log.projectId === project.id && !log.isBlankWorksheet
      );

      // Filtrer par équipe si sélectionnée
      projectWorkLogs = filterWorkLogsByTeam(projectWorkLogs, selectedTeam, teams);

      // Trier par date (plus récent en premier)
      const sortedLogs = projectWorkLogs.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      let lastPassageDate: Date | null = null;
      let daysSinceLastPassage: number | null = null;
      let lastPassageTeam: string | null = null;

      if (sortedLogs.length > 0) {
        const lastLog = sortedLogs[0];
        lastPassageDate = new Date(lastLog.date);
        daysSinceLastPassage = differenceInDays(new Date(), lastPassageDate);
        
        // Utiliser l'équipe principale du projet définie dans la fiche chantier
        lastPassageTeam = getPrimaryTeamForProject(project.id);
      }

      return {
        projectId: project.id,
        projectName: project.name,
        lastPassageDate,
        daysSinceLastPassage,
        totalPassages: projectWorkLogs.length,
        lastPassageTeam,
        primaryTeam: getPrimaryTeamForProject(project.id)
      };
    });

    // Trier par équipe principale, puis par date du dernier passage
    return history.sort((a, b) => {
      // Si un filtre d'équipe est sélectionné, prioriser les chantiers de cette équipe principale
      if (selectedTeam && selectedTeam !== 'all') {
        const aMatchesPrimary = a.primaryTeam?.toLowerCase().includes(selectedTeam.toLowerCase()) || false;
        const bMatchesPrimary = b.primaryTeam?.toLowerCase().includes(selectedTeam.toLowerCase()) || false;
        
        if (aMatchesPrimary && !bMatchesPrimary) return -1;
        if (!aMatchesPrimary && bMatchesPrimary) return 1;
      }
      
      // Ensuite trier par date du dernier passage (plus récent en premier, null à la fin)
      if (a.lastPassageDate && b.lastPassageDate) {
        return b.lastPassageDate.getTime() - a.lastPassageDate.getTime();
      }
      if (a.lastPassageDate && !b.lastPassageDate) return -1;
      if (!a.lastPassageDate && b.lastPassageDate) return 1;
      return a.projectName.localeCompare(b.projectName);
    });
  }, [workLogs, projectInfos, teams, selectedTeam, getPrimaryTeamForProject]);

  const getDaysSinceBadgeColor = (days: number | null) => {
    if (days === null) return 'secondary';
    if (days <= 8) return 'success';
    if (days <= 13) return 'secondary';
    if (days <= 15) return 'warning';
    if (days > 20) return 'danger';
    return 'destructive';
  };

  const getDaysSinceText = (days: number | null) => {
    if (days === null) return 'Aucun passage';
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    return `${days} jours`;
  };

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Building2 className="h-5 w-5" />
          Historique des chantiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Chantier</TableHead>
                <TableHead className="font-semibold text-center">Total passages</TableHead>
                <TableHead className="font-semibold text-center">Dernier passage</TableHead>
                <TableHead className="font-semibold text-center">Écart (jours)</TableHead>
                <TableHead className="font-semibold text-center">Équipe principale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {selectedTeam && selectedTeam !== 'all'
                        ? `Aucun chantier trouvé pour l'équipe "${selectedTeam}"`
                        : 'Aucun chantier trouvé'
                      }
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                projectHistory.map((project) => (
                  <TableRow key={project.projectId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {project.projectName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {project.totalPassages}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {project.lastPassageDate ? (
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <CalendarDays className="h-4 w-4" />
                          {format(project.lastPassageDate, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4" />
                        <Badge 
                          variant={getDaysSinceBadgeColor(project.daysSinceLastPassage)}
                          className="font-mono"
                        >
                          {getDaysSinceText(project.daysSinceLastPassage)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {project.primaryTeam ? (
                        <Badge variant="outline" className="text-xs font-medium">
                          {project.primaryTeam}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};