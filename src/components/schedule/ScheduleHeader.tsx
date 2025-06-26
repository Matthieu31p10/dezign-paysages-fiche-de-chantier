
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { useProjectLocks } from './project-locks/hooks/useProjectLocks';
import { useScheduleUpdater } from './hooks/useScheduleUpdater';

const ScheduleHeader: React.FC = () => {
  const { projectInfos } = useApp();
  const { projectLocks } = useProjectLocks();
  const { isUpdating, updateSchedule } = useScheduleUpdater(projectInfos);

  const handleGenerateSchedule = () => {
    const activeLocks = projectLocks.filter(lock => lock.isActive);
    const affectedProjects = activeLocks.length > 0 
      ? [...new Set(activeLocks.map(lock => lock.projectId))].length 
      : 0;
    
    console.log('Génération du planning avec les contraintes suivantes:');
    console.log('- Nombre de chantiers:', projectInfos.filter(p => !p.isArchived).length);
    console.log('- Nombre de verrouillages actifs:', activeLocks.length);
    console.log('- Nombre de chantiers affectés par des verrouillages:', affectedProjects);
    
    if (activeLocks.length > 0) {
      activeLocks.forEach(lock => {
        const project = projectInfos.find(p => p.id === lock.projectId);
        const dayNames = ['', 'lundis', 'mardis', 'mercredis', 'jeudis', 'vendredis', 'samedis', 'dimanches'];
        console.log(`- Verrouillage: ${project?.name || 'Chantier inconnu'} bloqué les ${dayNames[lock.dayOfWeek]} (${lock.reason})`);
      });
    }

    toast.success(
      "Planning généré avec succès",
      {
        description: activeLocks.length > 0 
          ? `${activeLocks.length} verrouillage${activeLocks.length > 1 ? 's' : ''} pris en compte`
          : "Aucune contrainte de verrouillage appliquée",
        duration: 4000,
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agenda des passages</h1>
        <p className="text-gray-600 mt-2">
          Planifiez et visualisez les passages prévus sur vos chantiers
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={updateSchedule} 
          disabled={isUpdating}
          className="hover:scale-105 transition-transform"
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Mise à jour...' : 'Mettre à jour l\'agenda'}
        </Button>
        
        <Button onClick={handleGenerateSchedule} className="hover:scale-105 transition-transform">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Générer le planning
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
