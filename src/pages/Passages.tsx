import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const Passages = () => {
  const { projectInfos, workLogs, teams } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Filtrer les projets actifs
  const activeProjects = projectInfos.filter(p => !p.isArchived);

  // Utiliser les équipes définies dans les paramètres
  const activeTeams = teams.filter(team => team.name && team.name.trim() !== '');

  // Filtrer les passages selon le projet et l'équipe sélectionnés (seulement les fiches de suivi, pas les blank worksheets)
  const filteredPassages = useMemo(() => {
    let realWorkLogs = workLogs.filter(log => !log.isBlankWorksheet);
    
    // Filtrer par projet
    if (selectedProjectId !== 'all') {
      realWorkLogs = realWorkLogs.filter(log => log.projectId === selectedProjectId);
    }
    
    // Filtrer par équipe - chercher l'équipe dans les projets assignés à cette équipe
    if (selectedTeam !== 'all') {
      const selectedTeamData = teams.find(t => t.id === selectedTeam);
      if (selectedTeamData) {
        // On filtre les work logs qui appartiennent à des projets assignés à cette équipe
        // Pour l'instant on garde la logique existante avec le personnel
        realWorkLogs = realWorkLogs.filter(log => 
          log.personnel && log.personnel.some(person => 
            selectedTeamData.name === person || person.includes(selectedTeamData.name)
          )
        );
      }
    }
    
    return realWorkLogs;
  }, [workLogs, selectedProjectId, selectedTeam, teams]);

  // Trier les passages par date (plus récent en premier)
  const sortedPassages = useMemo(() => {
    return [...filteredPassages].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredPassages]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (sortedPassages.length === 0) {
      return {
        lastPassageDate: null,
        daysSinceLastPassage: null,
        totalPassages: 0
      };
    }

    const lastPassage = sortedPassages[0];
    const lastPassageDate = new Date(lastPassage.date);
    const today = new Date();
    const daysSinceLastPassage = differenceInDays(today, lastPassageDate);

    return {
      lastPassageDate,
      daysSinceLastPassage,
      totalPassages: sortedPassages.length
    };
  }, [sortedPassages]);

  const getProjectName = (projectId: string) => {
    const project = projectInfos.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };

  const formatPassageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getDaysBadgeVariant = (days: number) => {
    if (days === 0) return 'default';
    if (days <= 7) return 'secondary';
    if (days <= 30) return 'outline';
    return 'destructive';
  };

  const getPassageCardStyle = (days: number) => {
    if (days === 0) return 'border-l-4 border-l-passage-success bg-passage-success/5';
    if (days <= 7) return 'border-l-4 border-l-passage-recent bg-passage-recent/5';
    if (days <= 30) return 'border-l-4 border-l-passage-warning bg-passage-warning/5';
    return 'border-l-4 border-l-destructive bg-destructive/5';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Passages</h1>
        <p className="text-muted-foreground">
          Visualisez les passages effectués et leur fréquence
        </p>
      </div>

      {/* Filtres */}
      <Card className="bg-background border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Chantier</label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Choisir un chantier" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">Tous les chantiers</SelectItem>
                  {activeProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1 text-foreground">
                <Users className="h-4 w-4" />
                Équipe
              </label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Choisir une équipe" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  {activeTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total des passages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalPassages}</div>
          </CardContent>
        </Card>

        <Card className="bg-background border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.lastPassageDate 
                ? format(stats.lastPassageDate, 'd MMM yyyy', { locale: fr })
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
              {stats.daysSinceLastPassage !== null ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl font-bold ${
                      stats.daysSinceLastPassage === 0 ? 'text-green-600' :
                      stats.daysSinceLastPassage <= 7 ? 'text-blue-600' :
                      stats.daysSinceLastPassage <= 30 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {stats.daysSinceLastPassage}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-foreground">
                        jour{stats.daysSinceLastPassage > 1 ? 's' : ''}
                      </span>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <Badge 
                    variant={getDaysBadgeVariant(stats.daysSinceLastPassage)} 
                    className={`text-sm px-3 py-1 ${
                      stats.daysSinceLastPassage === 0 ? 'bg-green-600 text-white' :
                      stats.daysSinceLastPassage <= 7 ? 'bg-blue-600 text-white' :
                      stats.daysSinceLastPassage <= 30 ? 'bg-orange-600 text-white' :
                      'bg-red-600 text-white'
                    }`}
                  >
                    {stats.daysSinceLastPassage === 0 ? "Aujourd'hui" : 
                     stats.daysSinceLastPassage === 1 ? "Hier" : 
                     stats.daysSinceLastPassage <= 7 ? "Récent" :
                     stats.daysSinceLastPassage <= 30 ? "À surveiller" :
                     "Attention requise"}
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">-</span>
              )}
            </div>
            {/* Indicateur visuel selon l'urgence */}
            {stats.daysSinceLastPassage !== null && stats.daysSinceLastPassage > 30 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-red-500 opacity-30"></div>
            )}
            {stats.daysSinceLastPassage !== null && stats.daysSinceLastPassage > 7 && stats.daysSinceLastPassage <= 30 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-orange-500 opacity-30"></div>
            )}
            {stats.daysSinceLastPassage !== null && stats.daysSinceLastPassage <= 7 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-green-500 opacity-30"></div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Liste des passages */}
      <Card className="bg-background border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5" />
            Historique des passages
          </CardTitle>
          <CardDescription>
            {selectedProjectId === 'all' 
              ? 'Tous les passages effectués sur l\'ensemble des chantiers'
              : `Passages effectués sur ${getProjectName(selectedProjectId)}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedPassages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun passage enregistré pour ce chantier</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPassages.map((passage, index) => {
                const today = new Date();
                const passageDate = new Date(passage.date);
                const daysAgo = differenceInDays(today, passageDate);
                
                return (
                  <div key={passage.id} className={`border border-border rounded-lg p-4 bg-background hover:bg-muted/50 transition-all duration-300 hover:shadow-md ${getPassageCardStyle(daysAgo)}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{getProjectName(passage.projectId)}</h3>
                          {selectedProjectId === 'all' && (
                            <Badge variant="outline" className="text-xs border-primary text-primary">
                              {getProjectName(passage.projectId)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatPassageDate(passage.date)}
                        </p>
                        {passage.personnel && passage.personnel.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Équipe: {passage.personnel.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={getDaysBadgeVariant(daysAgo)}
                          className={
                            daysAgo === 0 ? 'bg-green-600 text-white' :
                            daysAgo <= 7 ? 'bg-blue-600 text-white' :
                            daysAgo <= 30 ? 'bg-orange-600 text-white' :
                            'bg-red-600 text-white'
                          }
                        >
                          {daysAgo === 0 ? "Aujourd'hui" : 
                           daysAgo === 1 ? "Hier" : 
                           `Il y a ${daysAgo} jours`}
                        </Badge>
                        <div className="text-sm text-foreground font-medium">
                          {passage.timeTracking?.totalHours || passage.duration || 0}h
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Passages;