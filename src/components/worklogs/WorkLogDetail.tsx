
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/helpers';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import WorkLogForm from './WorkLogForm';
import { Edit, Trash, ArrowLeft, Calendar, Clock, User, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const WorkLogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workLogs, getProjectById, deleteWorkLog } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const workLog = workLogs.find(log => log.id === id);
  
  if (!workLog) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de suivi non trouvée</h2>
        <Button onClick={() => navigate('/worklogs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  const project = getProjectById(workLog.projectId);
  
  const handleDeleteWorkLog = () => {
    deleteWorkLog(workLog.id);
    navigate('/worklogs');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };
  
  const calculateEndTime = () => {
    if (!workLog) return "--:--";
    
    // Parse time strings into numbers
    const departureTimeParts = workLog.timeTracking.departure.split(':');
    const arrivalTimeParts = workLog.timeTracking.arrival.split(':');
    
    if (departureTimeParts.length !== 2 || arrivalTimeParts.length !== 2) {
      return "--:--";
    }
    
    const departureHour = Number(departureTimeParts[0]);
    const departureMinute = Number(departureTimeParts[1]);
    const arrivalHour = Number(arrivalTimeParts[0]);
    const arrivalMinute = Number(arrivalTimeParts[1]);
    
    // Calculate break time in minutes
    const breakTimeMinutes = workLog.timeTracking.breakTime * 60;
    
    // Convert times to minutes for easier calculation
    const departureInMinutes = departureHour * 60 + departureMinute;
    const arrivalInMinutes = arrivalHour * 60 + arrivalMinute;
    
    // Calculate total work minutes
    const totalWorkMinutes = arrivalInMinutes - departureInMinutes;
    
    // Calculate end time in minutes (departure + total work time)
    const endTimeInMinutes = departureInMinutes + totalWorkMinutes;
    
    // Convert end time back to hours and minutes
    const endHour = Math.floor(endTimeInMinutes / 60);
    const endMinute = endTimeInMinutes % 60;
    
    // Format and return the end time
    return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => navigate('/worklogs')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
            <Badge variant="outline" className="bg-brand-50 text-brand-700">
              {formatDate(workLog.date)}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold mt-2">
            {project?.name || 'Chantier inconnu'}
          </h1>
          <p className="text-muted-foreground">
            Fiche de suivi du {formatDate(workLog.date)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier la fiche de suivi</DialogTitle>
              </DialogHeader>
              <WorkLogForm initialData={workLog} onSuccess={handleEditSuccess} />
            </DialogContent>
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Elle supprimera définitivement la fiche de suivi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteWorkLog}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du passage</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    {formatDate(workLog.date)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Durée prévue</h3>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    {workLog.duration} heures
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Temps total</h3>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    {workLog.timeTracking.totalHours.toFixed(2)} heures
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Personnel présent</h3>
                <div className="space-y-1">
                  {workLog.personnel.map((person, index) => (
                    <p key={index} className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      {person}
                    </p>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Suivi du temps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Départ</p>
                    <p>{workLog.timeTracking.departure}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Arrivée</p>
                    <p>{workLog.timeTracking.arrival}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Heure de fin</p>
                    <p>{calculateEndTime()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Pause</p>
                    <p>{workLog.timeTracking.breakTime} heures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Travaux effectués</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tonte</span>
                  {workLog.tasksPerformed.mowing ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Débroussailleuse</span>
                  {workLog.tasksPerformed.brushcutting ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Souffleur</span>
                  {workLog.tasksPerformed.blower ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Désherbage manuel</span>
                  {workLog.tasksPerformed.manualWeeding ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vinaigre blanc</span>
                  {workLog.tasksPerformed.whiteVinegar ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taille</span>
                  {workLog.tasksPerformed.pruning.done ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                
                {workLog.tasksPerformed.pruning.done && (
                  <div className="pl-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avancement</span>
                      <span className="text-sm font-medium">
                        {workLog.tasksPerformed.pruning.progress}%
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-brand-500 h-1.5 rounded-full"
                          style={{ width: `${workLog.tasksPerformed.pruning.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Arrosage</span>
                  <Badge variant="outline" className={
                    workLog.tasksPerformed.watering === 'none'
                      ? 'bg-gray-100 text-gray-800'
                      : workLog.tasksPerformed.watering === 'on'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                  }>
                    {workLog.tasksPerformed.watering === 'none'
                      ? 'Pas d\'arrosage'
                      : workLog.tasksPerformed.watering === 'on'
                        ? 'Allumé'
                        : 'Coupé'
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/projects/${workLog.projectId}`)}
              >
                Voir le chantier
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkLogDetail;
