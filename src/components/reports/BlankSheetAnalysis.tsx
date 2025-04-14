
import React from 'react';
import { WorkLog } from '@/types/models';
import { filterWorkLogsByYear } from '@/utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPrice } from '@/utils/helpers';
import { FileText, Users, CreditCard, Ban } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BlankSheetAnalysisProps {
  workLogs: WorkLog[];
  selectedYear: number;
}

const BlankSheetAnalysis: React.FC<BlankSheetAnalysisProps> = ({ 
  workLogs, 
  selectedYear 
}) => {
  // Filtrer seulement les fiches vierges
  const blankSheets = workLogs.filter(log => 
    log.projectId && (log.projectId.startsWith('blank-') || log.projectId.startsWith('DZFV'))
  );
  
  // Filtrer par année
  const yearlyBlankSheets = filterWorkLogsByYear(blankSheets, selectedYear);
  
  // Statistiques de facturation
  const invoicedSheets = yearlyBlankSheets.filter(sheet => sheet.invoiced);
  const nonInvoicedSheets = yearlyBlankSheets.filter(sheet => !sheet.invoiced);
  
  const invoicedAmount = invoicedSheets.reduce((total, sheet) => 
    total + (sheet.signedQuoteAmount || 0), 0);
  
  const nonInvoicedAmount = nonInvoicedSheets.reduce((total, sheet) => 
    total + (sheet.signedQuoteAmount || 0), 0);
  
  const totalAmount = invoicedAmount + nonInvoicedAmount;
  
  // Statistiques de personnel
  const personnelCounts = {};
  
  yearlyBlankSheets.forEach(sheet => {
    if (sheet.personnel && Array.isArray(sheet.personnel)) {
      sheet.personnel.forEach(person => {
        personnelCounts[person] = (personnelCounts[person] || 0) + 1;
      });
    }
  });
  
  const topPersonnel = Object.entries(personnelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const totalPersonnelAssignments = Object.values(personnelCounts).reduce((a, b) => a + b, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fiches vierges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{yearlyBlankSheets.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total des fiches pour {selectedYear}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant facturé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-green-500 mr-2" />
              <div className="text-2xl font-bold">{formatPrice(invoicedAmount)}</div>
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{invoicedSheets.length} fiches facturées</span>
                <span>{totalAmount > 0 ? Math.round((invoicedAmount / totalAmount) * 100) : 0}%</span>
              </div>
              <Progress 
                value={totalAmount > 0 ? (invoicedAmount / totalAmount) * 100 : 0} 
                className="h-1 mt-1"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant non facturé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Ban className="h-4 w-4 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">{formatPrice(nonInvoicedAmount)}</div>
            </div>
            <div className="mt-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{nonInvoicedSheets.length} fiches non facturées</span>
                <span>{totalAmount > 0 ? Math.round((nonInvoicedAmount / totalAmount) * 100) : 0}%</span>
              </div>
              <Progress 
                value={totalAmount > 0 ? (nonInvoicedAmount / totalAmount) * 100 : 0} 
                className="h-1 mt-1"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">{Object.keys(personnelCounts).length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Personnel affecté aux fiches vierges
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personnel le plus assigné</CardTitle>
          </CardHeader>
          <CardContent>
            {topPersonnel.length > 0 ? (
              <div className="space-y-4">
                {topPersonnel.map(([name, count]) => (
                  <div key={name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{name}</span>
                      <span className="font-medium">{count} fiches</span>
                    </div>
                    <Progress 
                      value={(count / totalPersonnelAssignments) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
};

export default BlankSheetAnalysis;
