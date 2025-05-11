
import React from 'react';
import { useWorkLogDetail } from '../WorkLogDetailContext';

const FinancialSection: React.FC = () => {
  const { workLog } = useWorkLogDetail();
  
  // Vérifier si c'est une fiche vierge
  const isBlankWorksheet = workLog.projectId && (workLog.projectId.startsWith('blank-') || workLog.projectId.startsWith('DZFV'));
  
  if (!isBlankWorksheet || workLog.signedQuoteAmount <= 0) {
    return null;
  }
  
  return (
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
  );
};

export default FinancialSection;
