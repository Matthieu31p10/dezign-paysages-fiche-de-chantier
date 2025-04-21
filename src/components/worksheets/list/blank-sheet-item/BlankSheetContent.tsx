
import React from 'react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Link2, CheckCircle2, AlertTriangle, Clock, Euro } from 'lucide-react';
import { formatDate } from '@/utils/date';
import BlankSheetStats from './BlankSheetStats';

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
  
  return (
    <div className="space-y-2 mt-2">
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
  );
};

export default BlankSheetContent;
