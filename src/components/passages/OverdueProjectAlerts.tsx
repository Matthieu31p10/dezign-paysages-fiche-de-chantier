import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { WorkLog } from '@/types/models';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OverdueProjectAlertsProps {
  passages: WorkLog[];
  getProjectName: (projectId: string) => string;
  onProjectSelect?: (projectId: string) => void;
}

interface ProjectAlert {
  projectId: string;
  projectName: string;
  lastPassageDate: Date;
  daysSinceLastPassage: number;
  passageCount: number;
  urgencyLevel: 'warning' | 'danger' | 'critical';
}

export const OverdueProjectAlerts: React.FC<OverdueProjectAlertsProps> = ({
  passages,
  getProjectName,
  onProjectSelect
}) => {
  const projectAlerts = useMemo(() => {
    // Grouper les passages par projet
    const projectMap = new Map<string, WorkLog[]>();
    
    passages.forEach(passage => {
      if (!projectMap.has(passage.projectId)) {
        projectMap.set(passage.projectId, []);
      }
      projectMap.get(passage.projectId)!.push(passage);
    });
    
    // Calculer les alertes pour chaque projet
    const alerts: ProjectAlert[] = [];
    
    projectMap.forEach((projectPassages, projectId) => {
      // Trier par date décroissante
      const sortedPassages = projectPassages.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const lastPassage = sortedPassages[0];
      const lastPassageDate = new Date(lastPassage.date);
      const daysSince = differenceInDays(new Date(), lastPassageDate);
      
      // Déterminer le niveau d'urgence
      let urgencyLevel: 'warning' | 'danger' | 'critical';
      if (daysSince > 90) {
        urgencyLevel = 'critical';
      } else if (daysSince > 30) {
        urgencyLevel = 'danger';
      } else if (daysSince > 14) {
        urgencyLevel = 'warning';
      } else {
        return; // Pas d'alerte nécessaire
      }
      
      alerts.push({
        projectId,
        projectName: getProjectName(projectId),
        lastPassageDate,
        daysSinceLastPassage: daysSince,
        passageCount: projectPassages.length,
        urgencyLevel
      });
    });
    
    // Trier par urgence puis par nombre de jours
    return alerts.sort((a, b) => {
      const urgencyOrder = { critical: 3, danger: 2, warning: 1 };
      if (urgencyOrder[a.urgencyLevel] !== urgencyOrder[b.urgencyLevel]) {
        return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
      }
      return b.daysSinceLastPassage - a.daysSinceLastPassage;
    });
  }, [passages, getProjectName]);

  const getAlertConfig = (level: 'warning' | 'danger' | 'critical') => {
    switch (level) {
      case 'critical':
        return {
          className: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
          iconColor: 'text-red-600 dark:text-red-400',
          badgeClassName: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300',
          title: 'Critique'
        };
      case 'danger':
        return {
          className: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
          iconColor: 'text-orange-600 dark:text-orange-400',
          badgeClassName: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300',
          title: 'Urgent'
        };
      case 'warning':
        return {
          className: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          badgeClassName: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300',
          title: 'Attention'
        };
    }
  };

  if (projectAlerts.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-100">
                Tous les projets sont à jour
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Aucun projet n'a besoin d'attention particulière.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Projets nécessitant attention
          <Badge variant="secondary" className="ml-2">
            {projectAlerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projectAlerts.map((alert) => {
          const config = getAlertConfig(alert.urgencyLevel);
          
          return (
            <Alert key={alert.projectId} className={config.className}>
              <AlertDescription>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-sm">{alert.projectName}</h4>
                        <Badge variant="outline" className={`text-xs ${config.badgeClassName}`}>
                          {config.title}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Dernier passage: {format(alert.lastPassageDate, 'd MMM yyyy', { locale: fr })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.daysSinceLastPassage} jour{alert.daysSinceLastPassage > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.passageCount} passage{alert.passageCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {onProjectSelect && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onProjectSelect(alert.projectId)}
                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
        
        {/* Résumé en bas */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            {projectAlerts.filter(a => a.urgencyLevel === 'critical').length > 0 && (
              <span className="text-red-600 font-medium">
                {projectAlerts.filter(a => a.urgencyLevel === 'critical').length} projet{projectAlerts.filter(a => a.urgencyLevel === 'critical').length > 1 ? 's' : ''} critique{projectAlerts.filter(a => a.urgencyLevel === 'critical').length > 1 ? 's' : ''}
              </span>
            )}
            {projectAlerts.filter(a => a.urgencyLevel === 'critical').length > 0 && 
             projectAlerts.filter(a => a.urgencyLevel === 'danger').length > 0 && ' • '}
            {projectAlerts.filter(a => a.urgencyLevel === 'danger').length > 0 && (
              <span className="text-orange-600 font-medium">
                {projectAlerts.filter(a => a.urgencyLevel === 'danger').length} urgent{projectAlerts.filter(a => a.urgencyLevel === 'danger').length > 1 ? 's' : ''}
              </span>
            )}
            {(projectAlerts.filter(a => a.urgencyLevel === 'critical').length > 0 || 
              projectAlerts.filter(a => a.urgencyLevel === 'danger').length > 0) && 
             projectAlerts.filter(a => a.urgencyLevel === 'warning').length > 0 && ' • '}
            {projectAlerts.filter(a => a.urgencyLevel === 'warning').length > 0 && (
              <span className="text-yellow-600">
                {projectAlerts.filter(a => a.urgencyLevel === 'warning').length} à surveiller
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};