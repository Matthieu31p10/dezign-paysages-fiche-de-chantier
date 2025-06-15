
import React from 'react';
import { Clock } from 'lucide-react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const TimeDeviationSection: React.FC = () => {
  const { workLog, project, workLogs } = useWorkLogDetail();

  // Vérifier si c'est une fiche vierge
  const isBlankWorksheet = workLog?.projectId && 
    (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));

  if (isBlankWorksheet || !project) {
    return null;
  }

  // Calcul selon la formule: Durée prévue - (Heures effectuées / nombre de passages)
  const calculateTimeDeviation = () => {
    if (!project || !workLogs) return { text: "N/A", className: "text-gray-600" };

    // Filtrer les fiches de suivi pour ce projet
    const projectWorkLogs = workLogs.filter(log => log.projectId === project.id);
    const numberOfVisits = projectWorkLogs.length;
    
    if (numberOfVisits === 0) {
      return { text: "Pas de passages", className: "text-gray-600" };
    }
    
    // Calculer le total des heures effectuées pour ce projet
    const totalHours = projectWorkLogs.reduce((total, log) => {
      const hours = log.timeTracking?.totalHours || 0;
      return total + (typeof hours === 'string' ? parseFloat(hours) : hours);
    }, 0);
    
    // Moyenne des heures par passage
    const averageHoursPerVisit = totalHours / numberOfVisits;
    
    // Durée prévue par visite
    const plannedDuration = project.visitDuration || 0;
    
    if (plannedDuration === 0) {
      return { text: "Durée non définie", className: "text-gray-600" };
    }
    
    // Calcul de l'écart: Durée prévue - (Heures effectuées / nombre de passages)
    const deviation = plannedDuration - averageHoursPerVisit;
    
    // Formatage du texte
    const sign = deviation >= 0 ? '+' : '';
    const deviationText = `${sign}${deviation.toFixed(2)}h`;
    
    // Couleur selon l'écart
    let className = 'text-gray-600';
    if (deviation > 0) {
      className = 'text-green-600'; // Temps économisé
    } else if (deviation < 0) {
      className = 'text-red-600'; // Dépassement
    }
    
    return { text: deviationText, className };
  };

  const { text: deviationText, className: deviationClass } = calculateTimeDeviation();

  return (
    <div className="p-3 border rounded-md bg-gray-50">
      <h3 className="text-sm font-medium mb-2">Écart du temps de passage</h3>
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className={`font-medium ${deviationClass}`}>
          {deviationText}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Durée prévue - (heures effectuées / nombre de passages)
      </p>
    </div>
  );
};

export default TimeDeviationSection;
