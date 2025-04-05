
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Edit, Trash, Calendar, Clock, Users, 
  FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import { getFormattedDuration } from '../list/utils';
import DeleteWorkTaskDialog from './DeleteWorkTaskDialog';

const WorkTaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workTasks, deleteWorkTask } = useApp();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const workTask = workTasks.find((task) => task.id === id);
  
  if (!workTask) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-medium mb-2">Fiche de travaux introuvable</h2>
        <p className="text-muted-foreground mb-6">
          La fiche de travaux que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/worktasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux fiches de travaux
        </Button>
      </div>
    );
  }
  
  // Format the task date
  const formattedDate = format(new Date(workTask.date), 'dd MMMM yyyy', { locale: fr });
  
  const handleDelete = () => {
    deleteWorkTask(workTask.id);
    navigate('/worktasks');
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2"
            onClick={() => navigate('/worktasks')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour aux fiches
          </Button>
          <h1 className="text-2xl font-semibold">{workTask.title}</h1>
          <p className="text-muted-foreground">{workTask.location}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate(`/worktasks/edit/${workTask.id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Basic info */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formattedDate}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Durée</h3>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {workTask.duration} {workTask.duration > 1 ? 'heures' : 'heure'}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
                <div>
                  <p className="font-medium">{workTask.client.name}</p>
                  <p className="text-sm">{workTask.client.phone}</p>
                  <p className="text-sm">{workTask.client.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Personnel</h3>
                <div className="flex flex-wrap gap-2">
                  {workTask.personnel.map((person) => (
                    <Badge key={person} variant="secondary">
                      <Users className="h-3.5 w-3.5 mr-1.5" />
                      {person}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {workTask.materials && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Matériel utilisé</h3>
                  <p>{workTask.materials}</p>
                </div>
              )}
              
              {workTask.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p className="whitespace-pre-wrap">{workTask.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tâches réalisées</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {workTask.tasksPerformed.mowing && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Tonte
                  </li>
                )}
                {workTask.tasksPerformed.brushcutting && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Débrousaillage
                  </li>
                )}
                {workTask.tasksPerformed.blower && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Soufflage
                  </li>
                )}
                {workTask.tasksPerformed.manualWeeding && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Désherbage manuel
                  </li>
                )}
                {workTask.tasksPerformed.whiteVinegar && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Vinaigre blanc
                  </li>
                )}
                {workTask.tasksPerformed.pruning.done && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Taille ({workTask.tasksPerformed.pruning.progress}%)
                  </li>
                )}
                {workTask.tasksPerformed.watering !== 'none' && (
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    Arrosage: {workTask.tasksPerformed.watering === 'on' ? 'Mis en route' : 'Arrêté'}
                    {workTask.waterConsumption && ` (${workTask.waterConsumption} m³)`}
                  </li>
                )}
                
                {/* Custom tasks */}
                {workTask.tasksPerformed.customTasks && 
                  Object.entries(workTask.tasksPerformed.customTasks).map(([id, done]) => {
                    if (done) {
                      const progress = workTask.tasksPerformed.tasksProgress?.[id];
                      const taskName = id;
                      return (
                        <li key={id} className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          {taskName}{progress ? ` (${progress}%)` : ''}
                        </li>
                      );
                    }
                    return null;
                  })
                }
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Time tracking */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Suivi du temps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Départ dépôt</h3>
                <p>{workTask.timeTracking.departure}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Arrivée chantier</h3>
                <p>{workTask.timeTracking.arrival}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Fin chantier</h3>
                <p>{workTask.timeTracking.end}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Pause</h3>
                <p>{workTask.timeTracking.breakTime}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Heures totales</h3>
                <p className="font-medium">
                  {getFormattedDuration(workTask.timeTracking.totalHours)}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {workTask.wasteManagement && workTask.wasteManagement !== 'none' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Gestion des déchets</CardTitle>
              </CardHeader>
              <CardContent>
                {workTask.wasteManagement === 'one_big_bag' && '1 big bag'}
                {workTask.wasteManagement === 'two_big_bags' && '2 big bags'}
                {workTask.wasteManagement === 'half_dumpster' && 'Demi benne'}
                {workTask.wasteManagement === 'one_dumpster' && 'Une benne'}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <DeleteWorkTaskDialog 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default WorkTaskDetail;
