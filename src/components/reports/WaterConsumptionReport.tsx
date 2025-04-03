
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { ProjectInfo } from '@/types/models';
import { calculateWaterConsumptionStats } from '@/utils/statistics';
import { formatDate } from '@/utils/date';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WaterConsumptionReport = () => {
  const { projectInfos, workLogs } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  // Filtrer les projets qui ont l'arrosage activé
  const projectsWithIrrigation = projectInfos.filter(
    project => project.irrigation === 'irrigation'
  );
  
  // Obtenir le projet sélectionné
  const selectedProject = projectsWithIrrigation.find(p => p.id === selectedProjectId);
  
  // Obtenir les logs pour le projet sélectionné
  const projectWorkLogs = selectedProject 
    ? workLogs.filter(log => log.projectId === selectedProject.id)
    : [];
  
  // Calculer les statistiques de consommation d'eau
  const waterStats = calculateWaterConsumptionStats(projectWorkLogs);
  
  // Préparer les données pour le graphique
  const chartData = waterStats.monthlyConsumption.map(data => ({
    month: new Date(2023, data.month, 1).toLocaleString('fr-FR', { month: 'long' }),
    consommation: data.consumption
  }));
  
  // Obtenir les logs avec consommation d'eau
  const logsWithConsumption = projectWorkLogs.filter(log => 
    log.waterConsumption !== undefined && log.waterConsumption > 0
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rapport de consommation d'eau</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {projectsWithIrrigation.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              Aucun chantier avec arrosage n'est configuré.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="project-select" className="block text-sm font-medium">
                Sélectionner un chantier
              </label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project-select" className="w-full sm:w-96">
                  <SelectValue placeholder="Choisir un chantier avec arrosage" />
                </SelectTrigger>
                <SelectContent>
                  {projectsWithIrrigation.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedProject ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Consommation totale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{waterStats.totalConsumption} m³</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Dernier relevé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {waterStats.lastReading ? (
                        <div>
                          <p className="text-2xl font-bold">{waterStats.lastReading.consumption} m³</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(waterStats.lastReading.date)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Aucun relevé</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Relevés enregistrés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{logsWithConsumption.length}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {chartData.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Consommation mensuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis unit=" m³" />
                            <Tooltip formatter={(value) => [`${value} m³`, 'Consommation']} />
                            <Bar dataKey="consommation" fill="#8884d8" name="Consommation" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {logsWithConsumption.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Historique des relevés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Volume (m³)</TableHead>
                            <TableHead>Observations</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logsWithConsumption.map(log => (
                            <TableRow key={log.id}>
                              <TableCell>{formatDate(log.date)}</TableCell>
                              <TableCell>{log.waterConsumption}</TableCell>
                              <TableCell>{log.notes ? log.notes.substring(0, 50) + (log.notes.length > 50 ? '...' : '') : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 border rounded-md">
                <p className="text-muted-foreground">
                  Sélectionnez un chantier pour voir les statistiques de consommation d'eau
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterConsumptionReport;
