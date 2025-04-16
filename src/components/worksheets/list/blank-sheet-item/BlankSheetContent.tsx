
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Link2, CheckCircle2, AlertTriangle, Clock, Euro } from 'lucide-react';
import { formatDate } from '@/utils/date';
import BlankSheetStats from './BlankSheetStats';
import BlankSheetHeader from './BlankSheetHeader';

interface BlankSheetContentProps {
  sheet: WorkLog;
  linkedProject?: ProjectInfo | null;
}

const BlankSheetContent: React.FC<BlankSheetContentProps> = ({
  sheet,
  linkedProject
}) => {
  if (!sheet) return null;
  
  // Formatage des valeurs numériques
  const formatNumberValue = (value: string | number): string => {
    if (typeof value === 'string') {
      return parseFloat(value).toLocaleString('fr-FR', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2 
      });
    }
    return value.toLocaleString('fr-FR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    });
  };
  
  // Extraction des informations de contact
  const clientName = sheet.clientName || '';
  const address = sheet.address || '';
  const contactPhone = sheet.contactPhone || '';
  const contactEmail = sheet.contactEmail || '';
  
  // Calcul du coût total
  const totalHours = sheet.timeTracking?.totalHours || 0;
  const hourlyRate = sheet.hourlyRate || 0;
  const personnelCount = sheet.personnel?.length || 1;
  const totalCost = totalHours * hourlyRate * personnelCount;
  
  // Informations sur le devis
  const hasQuoteValue = sheet.signedQuoteAmount && sheet.signedQuoteAmount > 0;
  const quoteValue = sheet.signedQuoteAmount || 0;
  
  // Facturation et signature
  const invoiced = sheet.invoiced || false;
  const hasSignature = Boolean(sheet.clientSignature);
  const signedQuote = Boolean(sheet.isQuoteSigned);
  
  const hasHourlyRate = hourlyRate > 0;
  
  return (
    <div className="flex-1">
      <BlankSheetHeader 
        clientName={clientName}
        projectId={sheet.projectId}
        date={sheet.date}
        registrationTime={sheet.createdAt ? (typeof sheet.createdAt === 'string' ? sheet.createdAt : sheet.createdAt.toISOString()) : null}
        invoiced={invoiced}
      />
      
      <div className="space-y-2 mt-2">
        {clientName && (
          <div className="flex items-center text-sm">
            <span className="font-medium">{clientName}</span>
          </div>
        )}
        
        {address && (
          <div className="flex items-center text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <span>{address}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {contactPhone && (
            <div className="flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <span>{contactPhone}</span>
            </div>
          )}
          
          {contactEmail && (
            <div className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <span>{contactEmail}</span>
            </div>
          )}
          
          {linkedProject && (
            <div className="flex items-center">
              <Link2 className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <span>Projet lié: {linkedProject.name}</span>
            </div>
          )}
        </div>
      </div>
      
      <BlankSheetStats 
        hourlyRate={hourlyRate}
        hasHourlyRate={hasHourlyRate}
        totalHours={totalHours}
        personnelCount={personnelCount}
        totalCost={totalCost}
        quoteValue={quoteValue}
        hasQuoteValue={hasQuoteValue}
        signedQuote={signedQuote}
        hasSignature={hasSignature}
        formatNumberValue={formatNumberValue}
      />
    </div>
  );
};

export default BlankSheetContent;
