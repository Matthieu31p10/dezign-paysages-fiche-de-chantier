import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const Passages = () => {
  const { projectInfos, workLogs } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Filtrer les projets actifs
  const activeProjects = projectInfos.filter(p => !p.isArchived);

  // Filtrer les passages selon le projet sélectionné
  const filteredPassages = useMemo(() => {
    if (selectedProjectId === 'all') {
      return workLogs;
    }
    return workLogs.filter(log => log.projectId === selectedProjectId);
  }, [workLogs, selectedProjectId]);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Passages</h1>
        <p className="text-gray-600 mt-2">
          Visualisez les passages effectués et leur fréquence
        </p>
      </div>

      {/* Filtre par projet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Sélection du chantier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total des passages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPassages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastPassageDate 
                ? format(stats.lastPassageDate, 'd MMM yyyy', { locale: fr })
                : 'Aucun'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Écart depuis le dernier passage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stats.daysSinceLastPassage !== null ? (
                <>
                  <Badge variant={getDaysBadgeVariant(stats.daysSinceLastPassage)}>
                    {stats.daysSinceLastPassage} jour{stats.daysSinceLastPassage > 1 ? 's' : ''}
                  </Badge>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des passages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
                  <div key={passage.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
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
                        <Badge variant={getDaysBadgeVariant(daysAgo)}>
                          {daysAgo === 0 ? "Aujourd'hui" : 
                           daysAgo === 1 ? "Hier" : 
                           `Il y a ${daysAgo} jours`}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
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