
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EuroIcon, BadgeCheck, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/format-utils';
import { BlankWorkSheetValues } from '../schema';

const FinancialSummarySection: React.FC = () => {
  const { watch } = useFormContext<BlankWorkSheetValues>();
  
  // Get all the values we need for calculations
  const totalHours = watch('totalHours') || 0;
  const personnel = watch('personnel') || [];
  const personnelCount = personnel.length || 1;
  const hourlyRate = watch('hourlyRate') || 0;
  const consumables = watch('consumables') || [];
  const signedQuoteAmount = watch('signedQuoteAmount') || 0;
  const isQuoteSigned = watch('isQuoteSigned') || false;
  
  // Calculate totals
  const totalTeamHours = totalHours * personnelCount;
  const laborCost = totalTeamHours * hourlyRate;
  const totalConsumables = consumables.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalEstimate = laborCost + totalConsumables;
  
  // Calculate difference if quote is signed
  const difference = signedQuoteAmount > 0 ? signedQuoteAmount - totalEstimate : 0;
  const isPositiveDifference = difference >= 0;
  
  return (
    <Card className="border-green-200 shadow-sm bg-gradient-to-r from-green-50 to-white">
      <CardHeader className="pb-2 border-b border-green-100">
        <CardTitle className="text-lg flex items-center text-green-800">
          <EuroIcon className="h-5 w-5 mr-2 text-green-600" />
          Bilan Financier
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-700">Détails des coûts</h3>
            
            <div className="grid grid-cols-2 gap-1 bg-white p-3 rounded-md border border-green-100">
              <span className="text-sm">Main d'œuvre:</span>
              <span className="text-sm font-medium text-right">{formatCurrency(laborCost)}</span>
              
              <span className="text-sm">Fournitures:</span>
              <span className="text-sm font-medium text-right">{formatCurrency(totalConsumables)}</span>
              
              <span className="text-sm font-medium border-t border-green-100 pt-1 mt-1">TOTAL ESTIMÉ:</span>
              <span className="text-sm font-bold text-right border-t border-green-100 pt-1 mt-1">{formatCurrency(totalEstimate)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-700">Devis client</h3>
            
            <div className="bg-white p-3 rounded-md border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Montant du devis:</span>
                <span className="text-sm font-medium">{formatCurrency(signedQuoteAmount)}</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Statut:</span>
                {isQuoteSigned ? (
                  <span className="text-sm font-medium flex items-center text-green-600">
                    <BadgeCheck className="h-4 w-4 mr-1" />
                    Signé
                  </span>
                ) : (
                  <span className="text-sm font-medium flex items-center text-amber-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Non signé
                  </span>
                )}
              </div>
              
              {signedQuoteAmount > 0 && (
                <div className="mt-4 pt-2 border-t border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Différence:</span>
                    <span className={`text-sm font-bold ${isPositiveDifference ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositiveDifference ? '+' : ''}{formatCurrency(difference)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isPositiveDifference 
                      ? 'Le devis couvre l\'ensemble des frais.' 
                      : 'Le coût estimé dépasse le montant du devis.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummarySection;
