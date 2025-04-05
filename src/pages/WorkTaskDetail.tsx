
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Pencil, 
  Trash2, 
  User,
  MapPin,
  Phone,
  Clipboard,
  ReceiptText,
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { toast } from 'sonner';
import { generateWorkTaskPDF } from '@/utils/pdf/workTaskPDF';

const WorkTaskDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getWorkTaskById, deleteWorkTask } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the workTask by ID
  const workTask = id ? getWorkTaskById(id) : undefined;
  
  if (!workTask) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-medium mb-4">Fiche de travaux non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La fiche de travaux que vous cherchez n'existe pas ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/worktasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Format time values to hours and minutes
  const formatTimeValue = (hours: number): string => {
    const fullHours = Math.floor(hours);
    const minutes = Math.round((hours - fullHours) * 60);
    return `${fullHours}h${minutes.toString().padStart(2, '0')}`;
  };

  // Calculate total price for supplies
  const totalSuppliesPrice = workTask.supplies.reduce(
    (total, supply) => total + (supply.quantity * supply.unitPrice), 
    0
  );

  // Calculate labor cost
  const laborCost = workTask.timeTracking.workHours * workTask.hourlyRate;

  // Calculate total price
  const totalPrice = laborCost + totalSuppliesPrice;

  // Handle delete
  const handleDelete = () => {
    deleteWorkTask(workTask.id);
    toast.success("Fiche de travaux supprimée avec succès");
    navigate('/worktasks');
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    setIsLoading(true);
    try {
      await generateWorkTaskPDF({
        workTask,
        fileName: `Fiche_Travaux_${workTask.projectName}_${formatDate(workTask.date).replace(/\//g, '-')}.pdf`
      });
      toast.success("PDF généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2"
            onClick={() => navigate('/worktasks')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">{workTask.projectName}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePDF}
            disabled={isLoading}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/worktasks/edit/${workTask.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cette fiche de travaux sera définitivement supprimée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du chantier */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du chantier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Date</span>
                  </div>
                  <p className="font-medium">{formatDate(workTask.date)}</p>
                </div>
                <div>
                  <div className="flex items-center text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Adresse</span>
                  </div>
                  <p className="font-medium">{workTask.address}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center text-muted-foreground mb-1">
                  <User className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">Contact client</span>
                </div>
                <p className="font-medium">
                  {workTask.contactName} {workTask.clientPresent && <Badge variant="outline">Client présent</Badge>}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Personnel présent */}
          <Card>
            <CardHeader>
              <CardTitle>Personnel présent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {workTask.personnel.map((person, index) => (
                  <Badge key={index} variant="secondary" className="p-1.5">
                    {person}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Suivi du temps */}
          <Card>
            <CardHeader>
              <CardTitle>Suivi du temps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Départ</div>
                  <div className="font-medium">{workTask.timeTracking.departure}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Arrivée</div>
                  <div className="font-medium">{workTask.timeTracking.arrival}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Fin</div>
                  <div className="font-medium">{workTask.timeTracking.end}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pause</div>
                  <div className="font-medium">{workTask.timeTracking.breakTime}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Temps de déplacement</div>
                  <div className="font-medium">{formatTimeValue(workTask.timeTracking.travelHours)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Temps de travail</div>
                  <div className="font-medium">{formatTimeValue(workTask.timeTracking.workHours)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Temps total</div>
                  <div className="font-medium">{formatTimeValue(workTask.timeTracking.totalHours)}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Taux horaire</div>
                <div className="font-medium">{workTask.hourlyRate.toFixed(2)} €/h</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tableau des fournitures */}
          <Card>
            <CardHeader>
              <CardTitle>Fournitures</CardTitle>
            </CardHeader>
            <CardContent>
              {workTask.supplies.length === 0 ? (
                <p className="text-muted-foreground">Aucune fourniture enregistrée.</p>
              ) : (
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
                      </tr>
                    </thead>
                    <tbody>
                      {workTask.supplies.map((supply, index) => (
                        <tr key={index}>
                          <td className="border p-2">{supply.supplier}</td>
                          <td className="border p-2">{supply.material}</td>
                          <td className="border p-2">{supply.unit}</td>
                          <td className="border p-2 text-right">{supply.quantity}</td>
                          <td className="border p-2 text-right">{supply.unitPrice.toFixed(2)} €</td>
                          <td className="border p-2 text-right font-medium">
                            {(supply.quantity * supply.unitPrice).toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={5} className="border p-2 text-right font-medium">Total</td>
                        <td className="border p-2 text-right font-medium">
                          {totalSuppliesPrice.toFixed(2)} €
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Récapitulatif des coûts */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif des coûts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Temps de travail ({formatTimeValue(workTask.timeTracking.workHours)})</span>
                  <span>{laborCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Fournitures</span>
                  <span>{totalSuppliesPrice.toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notes */}
          {workTask.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes et observations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-muted/20 whitespace-pre-wrap">
                  {workTask.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Tâches personnalisées */}
          <Card>
            <CardHeader>
              <CardTitle>Tâches personnalisées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(workTask.tasksPerformed.customTasks).length === 0 ? (
                <p className="text-muted-foreground">Aucune tâche personnalisée.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(workTask.tasksPerformed.customTasks).map(([taskId, done]) => {
                    if (!done) return null;
                    const progress = workTask.tasksPerformed.tasksProgress?.[taskId] || 0;
                    
                    return (
                      <div key={taskId} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{taskId}</span>
                          <Badge variant={done ? "default" : "outline"}>
                            {done ? "Terminé" : "Non terminé"}
                          </Badge>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-right text-muted-foreground">
                          {progress}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Gestion des déchets */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion des déchets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${workTask.wasteManagement.wasteTaken ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Déchets emportés</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${workTask.wasteManagement.wasteLeft ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                <span>Déchets laissés sur place</span>
              </div>
              
              {workTask.wasteManagement.wasteDetails && (
                <div className="mt-3 border-t pt-2">
                  <div className="text-sm text-muted-foreground mb-1">Détails</div>
                  <p>{workTask.wasteManagement.wasteDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Signatures */}
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Signature du client</div>
                {workTask.signatures.client ? (
                  <div className="border rounded-md p-2 bg-white">
                    <img 
                      src={workTask.signatures.client} 
                      alt="Signature client"
                      className="w-full h-auto" 
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Pas de signature
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Signature du responsable</div>
                {workTask.signatures.teamLead ? (
                  <div className="border rounded-md p-2 bg-white">
                    <img 
                      src={workTask.signatures.teamLead} 
                      alt="Signature responsable"
                      className="w-full h-auto" 
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Pas de signature
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkTaskDetail;
