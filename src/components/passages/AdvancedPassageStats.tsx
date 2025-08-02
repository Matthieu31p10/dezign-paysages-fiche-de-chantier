import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users, MapPin, Calendar, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog } from '@/types/models';

interface AdvancedPassageStatsProps {
  totalPassages: number;
  lastPassageDate: Date | null;
  daysSinceLastPassage: number | null;
  passages: WorkLog[];
  getProjectName: (projectId: string) => string;
}

export const AdvancedPassageStats: React.FC<AdvancedPassageStatsProps> = ({
  totalPassages,
  lastPassageDate,
  daysSinceLastPassage,
  passages,
  getProjectName
}) => {
  const advancedStats = useMemo(() => {
    // Calcul des heures totales
    const totalHours = passages.reduce((sum, passage) => {
      return sum + (passage.timeTracking?.totalHours || passage.duration || 0);
    }, 0);

    // Calcul des équipes actives
    const activeTeams = new Set(
      passages
        .filter(p => p.personnel && p.personnel.length > 0)
        .map(p => p.personnel[0])
    ).size;

    // Calcul des projets actifs
    const activeProjects = new Set(passages.map(p => p.projectId)).size;

    // Moyenne de passages par semaine (sur les 4 dernières semaines)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentPassages = passages.filter(p => new Date(p.date) >= fourWeeksAgo);
    const avgPerWeek = Math.round(recentPassages.length / 4);

    // Durée moyenne par passage
    const passagesWithDuration = passages.filter(p => 
      (p.timeTracking?.totalHours || p.duration) && (p.timeTracking?.totalHours || p.duration) > 0
    );
    const avgDuration = passagesWithDuration.length > 0 
      ? totalHours / passagesWithDuration.length 
      : 0;

    // Projet le plus fréquenté
    const projectCounts: Record<string, number> = {};
    passages.forEach(passage => {
      projectCounts[passage.projectId] = (projectCounts[passage.projectId] || 0) + 1;
    });
    const mostFrequentProjectId = Object.entries(projectCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    const mostFrequentProject = mostFrequentProjectId 
      ? getProjectName(mostFrequentProjectId) 
      : null;

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      activeTeams,
      activeProjects,
      avgPerWeek,
      avgDuration: Math.round(avgDuration * 10) / 10,
      mostFrequentProject
    };
  }, [passages, getProjectName]);

  const getDaysBadgeVariant = (days: number) => {
    if (days === 0) return 'default';
    if (days <= 7) return 'secondary';
    if (days <= 30) return 'outline';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total des passages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-foreground">{totalPassages}</div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {advancedStats.avgPerWeek}/sem
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {lastPassageDate 
                ? format(lastPassageDate, 'd MMM yyyy', { locale: fr })
                : 'Aucun'
              }
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-background border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Écart depuis le dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-3">
              {daysSinceLastPassage !== null ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl font-bold ${
                      daysSinceLastPassage === 0 ? 'text-green-600' :
                      daysSinceLastPassage <= 7 ? 'text-blue-600' :
                      daysSinceLastPassage <= 30 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {daysSinceLastPassage}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-foreground">
                        jour{daysSinceLastPassage > 1 ? 's' : ''}
                      </span>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <Badge 
                    variant={getDaysBadgeVariant(daysSinceLastPassage)} 
                    className={`text-sm px-3 py-1 ${
                      daysSinceLastPassage === 0 ? 'bg-green-600 text-white' :
                      daysSinceLastPassage <= 7 ? 'bg-blue-600 text-white' :
                      daysSinceLastPassage <= 30 ? 'bg-orange-600 text-white' :
                      'bg-red-600 text-white'
                    }`}
                  >
                    {daysSinceLastPassage === 0 ? "Aujourd'hui" : 
                     daysSinceLastPassage === 1 ? "Hier" : 
                     daysSinceLastPassage <= 7 ? "Récent" :
                     daysSinceLastPassage <= 30 ? "À surveiller" :
                     "Attention requise"}
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">-</span>
              )}
            </div>
            {/* Indicateur visuel selon l'urgence */}
            {daysSinceLastPassage !== null && daysSinceLastPassage > 30 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-red-500 opacity-30"></div>
            )}
            {daysSinceLastPassage !== null && daysSinceLastPassage > 7 && daysSinceLastPassage <= 30 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-orange-500 opacity-30"></div>
            )}
            {daysSinceLastPassage !== null && daysSinceLastPassage <= 7 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-green-500 opacity-30"></div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Timer className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {advancedStats.totalHours}h
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Heures totales
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {advancedStats.activeTeams}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Équipes actives
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {advancedStats.activeProjects}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Projets actifs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {advancedStats.avgDuration}h
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  Durée moyenne
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projet le plus fréquenté */}
      {advancedStats.mostFrequentProject && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                  Projet le plus fréquenté
                </div>
                <div className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                  {advancedStats.mostFrequentProject}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};