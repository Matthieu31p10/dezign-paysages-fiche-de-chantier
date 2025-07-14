import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const Passages = () => {
  const { projectInfos, workLogs } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Filtrer les projets actifs
  const activeProjects = projectInfos.filter(p => !p.isArchived);

  // Extraire toutes les équipes uniques des work logs
  const allTeams = useMemo(() => {
    const teams = new Set<string>();
    workLogs.forEach(log => {
      if (!log.isBlankWorksheet && log.personnel) {
        log.personnel.forEach(person => teams.add(person));
      }
    });
    return Array.from(teams).sort();
  }, [workLogs]);

  // Filtrer les passages selon le projet et l'équipe sélectionnés (seulement les fiches de suivi, pas les blank worksheets)
  const filteredPassages = useMemo(() => {
    let realWorkLogs = workLogs.filter(log => !log.isBlankWorksheet);
    
    // Filtrer par projet
    if (selectedProjectId !== 'all') {
      realWorkLogs = realWorkLogs.filter(log => log.projectId === selectedProjectId);
    }
    
    // Filtrer par équipe
    if (selectedTeam !== 'all') {
      realWorkLogs = realWorkLogs.filter(log => 
        log.personnel && log.personnel.includes(selectedTeam)
      );
    }
    
    return realWorkLogs;
  }, [workLogs, selectedProjectId, selectedTeam]);

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
    if (days === 0) return 'border-l-4 border-l-passage-success bg-passage-success-light';
    if (days <= 7) return 'border-l-4 border-l-passage-recent bg-passage-recent-light';
    if (days <= 30) return 'border-l-4 border-l-passage-warning bg-passage-warning-light';
    return 'border-l-4 border-l-destructive bg-red-50';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Passages</h1>
        <p className="text-gray-600 mt-2">
          Visualisez les passages effectués et leur fréquence
        </p>
      </div>

      {/* Filtres */}
      <Card className="bg-gradient-to-br from-passage-accent via-green-50 to-passage-success-light border-passage-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-passage-success">
            <MapPin className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Chantier</label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="border-passage-accent focus:ring-passage-success">
                  <SelectValue placeholder="Choisir un chantier" />
                </SelectTrigger>
                <SelectContent>
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
              <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                <Users className="h-4 w-4" />
                Équipe
              </label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="border-passage-accent focus:ring-passage-success">
                  <SelectValue placeholder="Choisir une équipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les équipes</SelectItem>
                  {allTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
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
        <Card className="bg-gradient-to-br from-passage-success-light to-green-50 border-passage-success/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-passage-success">Total des passages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-passage-success">{stats.totalPassages}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-passage-recent-light to-green-25 border-passage-recent/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-passage-recent">Dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-passage-recent">
              {stats.lastPassageDate 
                ? format(stats.lastPassageDate, 'd MMM yyyy', { locale: fr })
                : 'Aucun'
              }
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-passage-accent border-green-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Écart depuis le dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start gap-3">
              {stats.daysSinceLastPassage !== null ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl font-bold ${
                      stats.daysSinceLastPassage === 0 ? 'text-passage-success' :
                      stats.daysSinceLastPassage <= 7 ? 'text-passage-recent' :
                      stats.daysSinceLastPassage <= 30 ? 'text-passage-warning' :
                      'text-destructive'
                    }`}>
                      {stats.daysSinceLastPassage}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-green-700">
                        jour{stats.daysSinceLastPassage > 1 ? 's' : ''}
                      </span>
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <Badge 
                    variant={getDaysBadgeVariant(stats.daysSinceLastPassage)} 
                    className={`text-sm px-3 py-1 animate-pulse ${
                      stats.daysSinceLastPassage === 0 ? 'bg-passage-success text-white' :
                      stats.daysSinceLastPassage <= 7 ? 'bg-passage-recent text-white' :
                      stats.daysSinceLastPassage <= 30 ? 'bg-passage-warning text-white' :
                      'bg-destructive text-white'
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
              <div className="absolute top-0 right-0 w-2 h-full bg-destructive opacity-20"></div>
            )}
            {stats.daysSinceLastPassage !== null && stats.daysSinceLastPassage > 7 && stats.daysSinceLastPassage <= 30 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-passage-warning opacity-20"></div>
            )}
            {stats.daysSinceLastPassage !== null && stats.daysSinceLastPassage <= 7 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-passage-success opacity-20"></div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Liste des passages */}
      <Card className="bg-gradient-to-br from-green-25 to-passage-accent border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-passage-success">
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
                  <div key={passage.id} className={`border rounded-lg p-4 hover:bg-passage-success-light/50 transition-all duration-300 hover:shadow-md ${getPassageCardStyle(daysAgo)}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{getProjectName(passage.projectId)}</h3>
                          {selectedProjectId === 'all' && (
                            <Badge variant="outline" className="text-xs">
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
                            daysAgo === 0 ? 'bg-passage-success text-white' :
                            daysAgo <= 7 ? 'bg-passage-recent text-white' :
                            daysAgo <= 30 ? 'bg-passage-warning text-white' :
                            'bg-destructive text-white'
                          }
                        >
                          {daysAgo === 0 ? "Aujourd'hui" : 
                           daysAgo === 1 ? "Hier" : 
                           `Il y a ${daysAgo} jours`}
                        </Badge>
                        <div className="text-sm text-passage-success font-medium">
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