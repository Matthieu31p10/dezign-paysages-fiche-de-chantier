
import React from 'react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const ConsumablesSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  // Vérifier si c'est une fiche vierge et si elle a des consommables
  const isBlankWorksheet = workLog.projectId && (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));
  
  if (!isBlankWorksheet || !workLog.consumables || workLog.consumables.length === 0) {
    return null;
  }
  
  return (
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
  );
};

export default ConsumablesSection;
