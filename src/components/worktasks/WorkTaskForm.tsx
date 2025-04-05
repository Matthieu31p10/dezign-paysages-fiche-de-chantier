import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '@/context/AppContext';
import { WorkTask, WorkTaskSupplier } from '@/types/workTask';

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, PlusCircle } from 'lucide-react';

import SignatureCanvas from 'react-signature-canvas';

const workTaskSchema = z.object({
  projectName: z.string().min(1, "Nom du chantier requis"),
  address: z.string().min(1, "Adresse requise"),
  contactName: z.string().min(1, "Nom du contact requis"),
  clientPresent: z.boolean().default(false),
  date: z.string().min(1, "Date requise"),
  personnel: z.array(z.string()).min(1, "Au moins une personne requise"),
  timeTracking: z.object({
    departure: z.string().min(1, "Heure de départ requise"),
    arrival: z.string().min(1, "Heure d'arrivée requise"),
    end: z.string().min(1, "Heure de fin requise"),
    breakTime: z.string().default("00:00"),
    travelHours: z.number().min(0),
    workHours: z.number().min(0),
    totalHours: z.number().min(0),
  }),
  tasksPerformed: z.object({
    customTasks: z.record(z.boolean()),
    tasksProgress: z.record(z.number()),
  }),
  wasteManagement: z.object({
    wasteTaken: z.boolean().default(false),
    wasteLeft: z.boolean().default(false),
    wasteDetails: z.string().optional(),
  }),
  notes: z.string().optional(),
  supplies: z.array(z.object({
    supplier: z.string(),
    material: z.string(),
    unit: z.string(),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
  })),
  hourlyRate: z.number().min(0),
});

type WorkTaskFormValues = z.infer<typeof workTaskSchema>;

interface WorkTaskFormProps {
  initialData?: WorkTask;
  onSuccess?: () => void;
}

const WorkTaskForm: React.FC<WorkTaskFormProps> = ({ initialData, onSuccess }) => {
  const { settings, addWorkTask, updateWorkTask } = useApp();
  const [clientSignature, setClientSignature] = useState<any>(null);
  const [teamLeadSignature, setTeamLeadSignature] = useState<any>(null);
  const [personnel, setPersonnel] = useState<string[]>(initialData?.personnel || []);
  const [newPerson, setNewPerson] = useState('');
  const [customTasks, setCustomTasks] = useState<Record<string, boolean>>(
    initialData?.tasksPerformed.customTasks || {}
  );
  
  const form = useForm<WorkTaskFormValues>({
    resolver: zodResolver(workTaskSchema),
    defaultValues: initialData ? {
      projectName: initialData.projectName,
      address: initialData.address,
      contactName: initialData.contactName,
      clientPresent: initialData.clientPresent,
      date: new Date(initialData.date).toISOString().split('T')[0],
      personnel: initialData.personnel,
      timeTracking: initialData.timeTracking,
      tasksPerformed: initialData.tasksPerformed,
      wasteManagement: initialData.wasteManagement,
      notes: initialData.notes || '',
      supplies: initialData.supplies || [],
      hourlyRate: initialData.hourlyRate || 0,
    } : {
      projectName: '',
      address: '',
      contactName: '',
      clientPresent: false,
      date: new Date().toISOString().split('T')[0],
      personnel: [],
      timeTracking: {
        departure: '',
        arrival: '',
        end: '',
        breakTime: '00:00',
        travelHours: 0,
        workHours: 0,
        totalHours: 0,
      },
      tasksPerformed: {
        customTasks: {},
        tasksProgress: {},
      },
      wasteManagement: {
        wasteTaken: false,
        wasteLeft: false,
        wasteDetails: '',
      },
      notes: '',
      supplies: [],
      hourlyRate: 0,
    }
  });

  const [supplies, setSupplies] = useState<WorkTaskSupplier[]>(
    initialData?.supplies || []
  );

  const handleAddPerson = () => {
    if (newPerson.trim() && !personnel.includes(newPerson.trim())) {
      const updatedPersonnel = [...personnel, newPerson.trim()];
      setPersonnel(updatedPersonnel);
      form.setValue('personnel', updatedPersonnel);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (personToRemove: string) => {
    const updatedPersonnel = personnel.filter(person => person !== personToRemove);
    setPersonnel(updatedPersonnel);
    form.setValue('personnel', updatedPersonnel);
  };

  const handleAddSupply = () => {
    const newSupply: WorkTaskSupplier = {
      supplier: '',
      material: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
    };
    setSupplies([...supplies, newSupply]);
    form.setValue('supplies', [...supplies, newSupply]);
  };

  const handleUpdateSupply = (index: number, field: keyof WorkTaskSupplier, value: any) => {
    const updatedSupplies = [...supplies];
    updatedSupplies[index] = {
      ...updatedSupplies[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value
    };
    setSupplies(updatedSupplies);
    form.setValue('supplies', updatedSupplies);
  };

  const handleRemoveSupply = (index: number) => {
    const updatedSupplies = supplies.filter((_, i) => i !== index);
    setSupplies(updatedSupplies);
    form.setValue('supplies', updatedSupplies);
  };

  const calculateTimeValues = () => {
    const timeTracking = form.getValues('timeTracking');
    if (timeTracking.departure && timeTracking.arrival && timeTracking.end) {
      const departureTime = convertTimeToMinutes(timeTracking.departure);
      const arrivalTime = convertTimeToMinutes(timeTracking.arrival);
      const endTime = convertTimeToMinutes(timeTracking.end);
      const breakTimeMinutes = convertTimeToMinutes(timeTracking.breakTime || '00:00');

      const travelHours = (arrivalTime - departureTime) / 60;
      
      const workHours = (endTime - arrivalTime - breakTimeMinutes) / 60;
      
      const totalHours = travelHours + workHours;
      
      form.setValue('timeTracking.travelHours', Math.round(travelHours * 100) / 100);
      form.setValue('timeTracking.workHours', Math.round(workHours * 100) / 100);
      form.setValue('timeTracking.totalHours', Math.round(totalHours * 100) / 100);
    }
  };

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr === '') return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const onSubmit = (values: WorkTaskFormValues) => {
    const formData: WorkTask | Omit<WorkTask, "id" | "createdAt"> = {
      ...(initialData ? { id: initialData.id, createdAt: initialData.createdAt } : {}),
      projectName: values.projectName,
      address: values.address,
      contactName: values.contactName,
      clientPresent: values.clientPresent,
      date: new Date(values.date),
      personnel: values.personnel,
      timeTracking: {
        departure: values.timeTracking.departure,
        arrival: values.timeTracking.arrival,
        end: values.timeTracking.end,
        breakTime: values.timeTracking.breakTime || '00:00',
        travelHours: values.timeTracking.travelHours,
        workHours: values.timeTracking.workHours,
        totalHours: values.timeTracking.totalHours,
      },
      tasksPerformed: values.tasksPerformed,
      wasteManagement: values.wasteManagement,
      notes: values.notes || '',
      supplies: values.supplies,
      hourlyRate: values.hourlyRate,
      signatures: {
        client: clientSignature?.getTrimmedCanvas().toDataURL('image/png') || null,
        teamLead: teamLeadSignature?.getTrimmedCanvas().toDataURL('image/png') || null,
      }
    };

    if (initialData) {
      updateWorkTask(formData as WorkTask);
    } else {
      addWorkTask(formData);
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  const clearSignatures = () => {
    if (clientSignature) clientSignature.clear();
    if (teamLeadSignature) teamLeadSignature.clear();
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('timeTracking.')) {
        calculateTimeValues();
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Section: Informations du chantier */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du chantier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du chantier</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact client</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clientPresent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Client présent sur le chantier
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section: Personnel présent */}
        <Card>
          <CardHeader>
            <CardTitle>Personnel présent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {personnel.map((person, index) => (
                <Badge key={index} variant="secondary" className="p-1.5">
                  {person}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleRemovePerson(person)}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Nom du membre du personnel"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddPerson}>
                Ajouter
              </Button>
            </div>
            
            {form.formState.errors.personnel && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.personnel.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Section: Suivi du temps */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi du temps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="timeTracking.departure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de départ</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeTracking.arrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure d'arrivée</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeTracking.end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="timeTracking.breakTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temps de pause</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>Format: HH:MM</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <FormLabel>Temps de déplacement</FormLabel>
                <div className="border rounded-md p-2 bg-muted/50">
                  {form.watch('timeTracking.travelHours').toFixed(2)} h
                </div>
              </div>
              
              <div>
                <FormLabel>Temps de travail</FormLabel>
                <div className="border rounded-md p-2 bg-muted/50">
                  {form.watch('timeTracking.workHours').toFixed(2)} h
                </div>
              </div>
              
              <div>
                <FormLabel>Temps total</FormLabel>
                <div className="border rounded-md p-2 bg-muted/50">
                  {form.watch('timeTracking.totalHours').toFixed(2)} h
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux horaire (€/h)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section: Tâches personnalisées */}
        <Card>
          <CardHeader>
            <CardTitle>Tâches personnalisées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.customTasks.length === 0 ? (
              <p className="text-muted-foreground">
                Aucune tâche personnalisée définie. Ajoutez-en dans les paramètres.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.customTasks.map((task) => (
                  <div key={task.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <FormField
                        control={form.control}
                        name={`tasksPerformed.customTasks.${task.id}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-medium">
                              {task.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name={`tasksPerformed.tasksProgress.${task.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Progression (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section: Gestion des déchets */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion des déchets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wasteManagement.wasteTaken"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Déchets emportés
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wasteManagement.wasteLeft"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Déchets laissés sur place
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="wasteManagement.wasteDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Détails sur les déchets</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Détails sur les déchets..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section: Tableau des fournitures */}
        <Card>
          <CardHeader>
            <CardTitle>Fournitures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Fournisseur</th>
                    <th className="border p-2 text-left">Matériaux</th>
                    <th className="border p-2 text-left">Unité</th>
                    <th className="border p-2 text-right">Quantité</th>
                    <th className="border p-2 text-right">Prix Unitaire (€)</th>
                    <th className="border p-2 text-right">Prix Total (€)</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {supplies.map((supply, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <Input
                          value={supply.supplier}
                          onChange={(e) => handleUpdateSupply(index, 'supplier', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          value={supply.material}
                          onChange={(e) => handleUpdateSupply(index, 'material', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          value={supply.unit}
                          onChange={(e) => handleUpdateSupply(index, 'unit', e.target.value)}
                          className="w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={supply.quantity}
                          onChange={(e) => handleUpdateSupply(index, 'quantity', e.target.value)}
                          className="w-full text-right"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={supply.unitPrice}
                          onChange={(e) => handleUpdateSupply(index, 'unitPrice', e.target.value)}
                          className="w-full text-right"
                        />
                      </td>
                      <td className="border p-2 text-right font-medium">
                        {(supply.quantity * supply.unitPrice).toFixed(2)} €
                      </td>
                      <td className="border p-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSupply(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="border p-2 text-right font-medium">Total</td>
                    <td className="border p-2 text-right font-medium">
                      {supplies.reduce((sum, supply) => sum + (supply.quantity * supply.unitPrice), 0).toFixed(2)} €
                    </td>
                    <td className="border p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Button type="button" variant="outline" onClick={handleAddSupply} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une fourniture
            </Button>
          </CardContent>
        </Card>

        {/* Section: Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes et observations</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Notes et observations complémentaires..."
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section: Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Signature du client</h3>
                <div className="border rounded-md p-1 bg-white">
                  <SignatureCanvas
                    ref={(ref) => setClientSignature(ref)}
                    canvasProps={{
                      className: 'w-full h-[150px] cursor-crosshair',
                      style: { backgroundColor: '#f8f8f8' }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Signature du responsable</h3>
                <div className="border rounded-md p-1 bg-white">
                  <SignatureCanvas
                    ref={(ref) => setTeamLeadSignature(ref)}
                    canvasProps={{
                      className: 'w-full h-[150px] cursor-crosshair',
                      style: { backgroundColor: '#f8f8f8' }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={clearSignatures}
              className="w-full"
            >
              Effacer les signatures
            </Button>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <Button type="submit" className="min-w-[150px]">
            {initialData ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default WorkTaskForm;
