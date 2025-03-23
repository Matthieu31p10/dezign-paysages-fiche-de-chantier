
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import WorkLogList from '@/components/worklogs/WorkLogList';
import { getCurrentYear } from '@/utils/helpers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CalendarX } from 'lucide-react';

const WorkLogs = () => {
  const navigate = useNavigate();
  const { workLogs, projectInfos } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');
  
  const filteredLogs = selectedProjectId === 'all'
    ? workLogs
    : workLogs.filter(log => log.projectId === selectedProjectId);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Suivi des travaux</h1>
          <p className="text-muted-foreground">
            Gérez vos fiches de suivi de chantier
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/worklogs/new')}
          disabled={projectInfos.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle fiche
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium block mb-2">Filtrer par chantier</label>
          <Select
            value={selectedProjectId}
            onValueChange={(value) => setSelectedProjectId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les chantiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les chantiers</SelectItem>
              {projectInfos.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Fiches de suivi</CardTitle>
          <CardDescription>
            {selectedProjectId === 'all'
              ? 'Toutes les fiches de suivi'
              : `Fiches de suivi pour ${projectInfos.find(p => p.id === selectedProjectId)?.name || 'ce chantier'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workLogs.length === 0 ? (
            <div className="text-center py-12">
              <CalendarX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Aucune fiche de suivi</h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore créé de fiche de suivi. Commencez par créer votre première fiche.
              </p>
              
              {projectInfos.length === 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Vous devez d'abord créer un chantier avant de pouvoir créer une fiche de suivi.
                  </p>
                  <Button onClick={() => navigate('/projects/new')}>
                    Créer un chantier
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/worklogs/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle fiche
                </Button>
              )}
            </div>
          ) : (
            <WorkLogList workLogs={filteredLogs} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkLogs;
