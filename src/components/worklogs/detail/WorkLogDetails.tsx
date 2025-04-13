
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Droplets, Trash2, Euro } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { useWorkLogDetail } from './WorkLogDetailContext';

const WorkLogDetails: React.FC = () => {
  const { workLog, calculateEndTime, calculateHourDifference, calculateTotalTeamHours } = useWorkLogDetail();
  
  // Fonction pour convertir le code de gestion des déchets en texte lisible
  const getWasteManagementText = (wasteCode?: string) => {
    if (!wasteCode || wasteCode === 'none') return 'Aucun';
    
    const parts = wasteCode.split('_');
    const type = parts[0];
    const quantity = parts.length > 1 ? parts[1] : '1';
    
    switch (type) {
      case 'big_bag': return `${quantity} Big-bag${quantity !== '1' ? 's' : ''}`;
      case 'half_dumpster': return `${quantity} × 1/2 Benne${quantity !== '1' ? 's' : ''}`;
      case 'dumpster': return `${quantity} Benne${quantity !== '1' ? 's' : ''}`;
      default: return wasteCode; // Fallback pour les anciens formats
    }
  };
  
  // Check if this is a blank worksheet (starts with blank- or DZFV)
  const isBlankWorksheet = workLog.projectId && (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Date</h3>
          <p className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            {formatDate(workLog.date)}
          </p>
        </div>
        
        {!isBlankWorksheet && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Durée prévue</h3>
            <p className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              {workLog.duration} heures
            </p>
          </div>
        )}
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Temps total (équipe)</h3>
          <p className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            {calculateTotalTeamHours()} heures
          </p>
        </div>
        
        {workLog.hourlyRate > 0 && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Taux horaire</h3>
            <p className="flex items-center">
              <Euro className="w-4 h-4 mr-2 text-muted-foreground" />
              {workLog.hourlyRate} €/h
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isBlankWorksheet && (
          <div className="p-3 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Écart du temps de passage</h3>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className={`font-medium ${
                calculateHourDifference().startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateHourDifference()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Durée prévue - (heures effectuées / nombre de passages)
            </p>
          </div>
        )}
        
        <div className="p-3 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Gestion des déchets</h3>
          <div className="flex items-center">
            <Trash2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">
              {getWasteManagementText(workLog.wasteManagement)}
            </span>
          </div>
        </div>
      </div>
      
      {workLog.waterConsumption !== undefined && (
        <div className="p-3 border rounded-md bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Consommation d'eau</h3>
          <div className="flex items-center">
            <Droplets className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">{workLog.waterConsumption} m³</span>
          </div>
        </div>
      )}
      
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Départ</p>
            <p>{workLog.timeTracking.departure || '--:--'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Arrivée</p>
            <p>{workLog.timeTracking.arrival || '--:--'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Heure de fin</p>
            <p>{workLog.timeTracking.end || calculateEndTime()}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Pause</p>
            <p>{workLog.timeTracking.breakTime || '00:00'}</p>
          </div>
        </div>
      </div>
      
      {/* Financial info for blank worksheets */}
      {isBlankWorksheet && workLog.signedQuoteAmount > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Informations financières</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Montant du devis</p>
                <p className="font-medium">{workLog.signedQuoteAmount} €</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Statut du devis</p>
                <p>{workLog.isQuoteSigned ? 'Signé' : 'Non signé'}</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Consumables for blank worksheets */}
      {isBlankWorksheet && workLog.consumables && workLog.consumables.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Fournitures</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Fournisseur</th>
                    <th className="text-left py-2">Produit</th>
                    <th className="text-right py-2">Qté</th>
                    <th className="text-right py-2">Prix unitaire</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {workLog.consumables.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-2">{item.supplier || '-'}</td>
                      <td className="py-2">{item.product || '-'}</td>
                      <td className="py-2 text-right">{item.quantity} {item.unit || ''}</td>
                      <td className="py-2 text-right">{item.unitPrice.toFixed(2)} €</td>
                      <td className="py-2 text-right font-medium">{item.totalPrice.toFixed(2)} €</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30">
                    <td colSpan={4} className="py-2 text-right font-medium">Total fournitures:</td>
                    <td className="py-2 text-right font-medium">
                      {workLog.consumables.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2)} €
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkLogDetails;
