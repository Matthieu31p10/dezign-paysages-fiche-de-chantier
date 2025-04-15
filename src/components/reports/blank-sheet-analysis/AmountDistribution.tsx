
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/utils/helpers';
import { Progress } from '@/components/ui/progress';

interface AmountDistributionProps {
  invoicedAmount: number;
  nonInvoicedAmount: number;
  totalAmount: number;
}

const AmountDistribution = ({ 
  invoicedAmount, 
  nonInvoicedAmount, 
  totalAmount 
}: AmountDistributionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Répartition des montants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-full justify-center">
          {totalAmount > 0 ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Facturé</span>
                </div>
                <span className="font-medium">{formatPrice(invoicedAmount)}</span>
              </div>
              <Progress 
                value={(invoicedAmount / totalAmount) * 100} 
                className="h-4 mb-4"
              />
              
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Non facturé</span>
                </div>
                <span className="font-medium">{formatPrice(nonInvoicedAmount)}</span>
              </div>
              <Progress 
                value={(nonInvoicedAmount / totalAmount) * 100} 
                className="h-4"
              />
              
              <div className="mt-4 text-center">
                <span className="text-sm text-muted-foreground">Montant total: </span>
                <span className="font-bold">{formatPrice(totalAmount)}</span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center">Aucun montant enregistré</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AmountDistribution;
