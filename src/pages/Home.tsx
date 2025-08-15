
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { FileText, Calendar, BarChart3, ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/utils/helpers";
import EnhancedDashboard from "@/components/dashboard/EnhancedDashboard";

const Home = () => {
  const navigate = useNavigate();
  const { projectInfos, workLogs } = useApp();
  const [activeTab, setActiveTab] = useState("enhanced");
  
  // Basic statistics
  const totalProjects = projectInfos.length;
  const totalWorkLogs = workLogs.length;
  const totalHours = workLogs.reduce((total, log) => total + log.timeTracking.totalHours, 0);
  
  // Most recent projects
  const recentProjects = [...projectInfos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Most recent work logs
  const recentWorkLogs = [...workLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Bienvenue sur Vertos Chantiers</h1>
        <p className="text-muted-foreground">
          Gérez facilement vos chantiers d'espaces verts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enhanced" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Dashboard Avancé
          </TabsTrigger>
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue Simplifiée
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced">
          <EnhancedDashboard />
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <CardTitle className="text-lg">Fiches chantier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalProjects}</p>
            <p className="text-sm text-muted-foreground">Chantiers actifs</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/projects')}
            >
              Voir les chantiers
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              <CardTitle className="text-lg">Suivi des travaux</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalWorkLogs}</p>
            <p className="text-sm text-muted-foreground">Fiches de suivi enregistrées</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/worklogs')}
            >
              Voir les suivis
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <CardTitle className="text-lg">Heures de travail</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatNumber(totalHours)}</p>
            <p className="text-sm text-muted-foreground">Heures travaillées au total</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/reports')}
            >
              Voir les rapports
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chantiers récents</CardTitle>
            <CardDescription>
              Les derniers chantiers ajoutés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.address}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Aucun chantier créé pour le moment
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => navigate('/projects/new')}
            >
              Créer un nouveau chantier
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dernières interventions</CardTitle>
            <CardDescription>
              Les dernières fiches de suivi enregistrées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkLogs.length > 0 ? (
                recentWorkLogs.map((workLog) => {
                  const project = projectInfos.find(p => p.id === workLog.projectId);
                  
                  return (
                    <div key={workLog.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">
                          {project?.name || 'Chantier inconnu'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workLog.date).toLocaleDateString()} - {formatNumber(workLog.timeTracking.totalHours)} heures
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/worklogs/${workLog.id}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Aucune fiche de suivi créée pour le moment
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => navigate('/worklogs/new')}
              disabled={projectInfos.length === 0}
            >
              Créer une nouvelle fiche de suivi
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-gradient-to-br from-brand-50 to-white">
          <CardContent className="pt-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-medium mb-2">
                  Gérez facilement vos chantiers d'espaces verts
                </h2>
                <p className="text-muted-foreground mb-4">
                  Vertos Chantiers vous permet de suivre tous vos projets d'espaces verts, 
                  de planifier les interventions et d'analyser les performances de vos équipes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => navigate('/projects/new')}>
                    Créer un chantier
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/reports')}
                  >
                    Voir les bilans
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[200px] aspect-square bg-brand-100 rounded-full flex items-center justify-center">
                  <FileText className="w-24 h-24 text-brand-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
