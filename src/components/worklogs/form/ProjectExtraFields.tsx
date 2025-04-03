
import React from 'react';
import { ProjectInfo, WorkLog } from '@/types/models';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { formSchema } from './schema';
import { formatDate } from '@/utils/date';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FormValues = z.infer<typeof formSchema>;

interface ProjectExtraFieldsProps {
  project: ProjectInfo;
  register: UseFormRegister<FormValues>;
  errors: Record<string, any>;
  existingWorkLogs?: WorkLog[];
}

const ProjectExtraFields: React.FC<ProjectExtraFieldsProps> = ({ 
  project, 
  register, 
  errors,
  existingWorkLogs = []
}) => {
  if (!project || project.irrigation === 'none') return null;
  
  // Filtrer les journaux de travail pour ce projet qui ont des données de consommation d'eau
  const waterConsumptionLogs = existingWorkLogs
    .filter(log => log.projectId === project.id && log.waterConsumption !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculer la consommation totale d'eau pour ce projet
  const totalWaterConsumption = waterConsumptionLogs.reduce(
    (total, log) => total + (log.waterConsumption || 0), 
    0
  );
  
  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Relevé d'arrosage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="waterConsumption" className="font-medium">Consommation d'eau du jour (m³)</Label>
              <Input 
                type="number" 
                id="waterConsumption" 
                step="0.1"
                placeholder="Entrez le volume d'eau consommé"
                className="mt-1"
                {...register("waterConsumption", {
                  valueAsNumber: true,
                })}
              />
              {errors.waterConsumption && (
                <p className="text-sm text-red-500 mt-1">{errors.waterConsumption.message}</p>
              )}
            </div>
            
            {waterConsumptionLogs.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-sm">Historique des relevés précédents</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Volume (m³)</TableHead>
                        <TableHead>Observations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waterConsumptionLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell>{formatDate(log.date)}</TableCell>
                          <TableCell>{log.waterConsumption}</TableCell>
                          <TableCell>{log.notes ? log.notes.substring(0, 50) + (log.notes.length > 50 ? '...' : '') : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md mt-2">
                  <p className="font-medium">Consommation totale: {totalWaterConsumption.toFixed(2)} m³</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectExtraFields;
