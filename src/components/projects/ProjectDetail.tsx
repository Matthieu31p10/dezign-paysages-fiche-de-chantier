
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { formatDate, formatNumber } from '@/utils/helpers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ProjectForm from './ProjectForm';
import { MapPin, Phone, Mail, Users, Calendar, Clock, Edit, Trash, ArrowLeft, FileText, File, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import WorkLogList from '../worklogs/WorkLogList';
import { Badge } from '@/components/ui/badge';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, getWorkLogsByProjectId, deleteProjectInfo, teams } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const project = getProjectById(id!);
  const workLogs = getWorkLogsByProjectId(id!);
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Chantier non trouvé</h2>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  const teamName = teams.find(team => team.id === project.team)?.name || 'Équipe non assignée';
  
  const handleDeleteProject = () => {
    deleteProjectInfo(project.id);
    navigate('/projects');
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };
  
  const totalCompletedHours = workLogs.reduce((total, log) => total + log.timeTracking.totalHours, 0);
  const completedVisits = workLogs.length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
            <Badge variant="outline" className="bg-brand-50 text-brand-700 hover:bg-brand-100">
              {teamName}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold mt-2">{project.name}</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1.5" />
            {project.address}
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
                <DialogTitle>Modifier la fiche chantier</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de la fiche chantier.
                </DialogDescription>
              </DialogHeader>
              <ProjectForm initialData={project} onSuccess={handleEditSuccess} />
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
                  Cette action est irréversible. Elle supprimera définitivement la fiche chantier
                  ainsi que toutes les fiches de suivi associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button size="sm" onClick={() => navigate(`/worklogs/new?projectId=${project.id}`)}>
            <Calendar className="w-4 h-4 mr-2" />
            Nouvelle fiche de suivi
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Informations</TabsTrigger>
          <TabsTrigger value="worklogs">Fiches de suivi ({workLogs.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détails du chantier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                        <div className="mt-1 space-y-1">
                          {project.contact.phone && (
                            <p className="flex items-center text-sm">
                              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                              {project.contact.phone}
                            </p>
                          )}
                          {project.contact.email && (
                            <p className="flex items-center text-sm">
                              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                              {project.contact.email}
                            </p>
                          )}
                          {!project.contact.phone && !project.contact.email && (
                            <p className="text-sm text-muted-foreground">Aucune information de contact</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Équipe responsable</h3>
                        <p className="mt-1 flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {teamName}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Informations de planification</h3>
                        <div className="mt-1 space-y-1">
                          <p className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            {project.annualVisits} passages par an
                          </p>
                          <p className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            {formatNumber(project.visitDuration)} heures par passage
                          </p>
                          <p className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            {formatNumber(project.annualTotalHours)} heures totales par an
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Informations du contrat</h3>
                        <div className="mt-1">
                          <p className="text-sm whitespace-pre-line">
                            {project.contract.details || "Aucune information sur le contrat"}
                          </p>
                          
                          {project.contract.documentUrl && (
                            <div className="mt-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={project.contract.documentUrl} target="_blank" rel="noopener noreferrer">
                                  <File className="w-4 h-4 mr-2" />
                                  Voir le document
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Informations complémentaires</h3>
                        <p className="mt-1 text-sm whitespace-pre-line">
                          {project.additionalInfo || "Aucune information complémentaire"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progression</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Passages effectués</span>
                      <span className="text-sm font-medium">
                        {completedVisits} / {project.annualVisits}
                      </span>
                    </div>
                    <progress 
                      className="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
                      value={completedVisits} 
                      max={project.annualVisits}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Heures effectuées</span>
                      <span className="text-sm font-medium">
                        {formatNumber(totalCompletedHours)} / {formatNumber(project.annualTotalHours)}
                      </span>
                    </div>
                    <progress 
                      className="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary"
                      value={totalCompletedHours} 
                      max={project.annualTotalHours}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Reste à effectuer</h3>
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">{project.annualVisits - completedVisits}</span> passages
                      </p>
                      <p>
                        <span className="font-medium">{formatNumber(project.annualTotalHours - totalCompletedHours)}</span> heures
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/worklogs/new?projectId=${project.id}`)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Nouvelle fiche de suivi
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="worklogs" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <CardTitle className="text-lg">Fiches de suivi</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/worklogs/new?projectId=${project.id}`)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Nouvelle fiche
                </Button>
              </div>
              <CardDescription>
                Fiches de suivi pour ce chantier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkLogList workLogs={workLogs} projectId={project.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
