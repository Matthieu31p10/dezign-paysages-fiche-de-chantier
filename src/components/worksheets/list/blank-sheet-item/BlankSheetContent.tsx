
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { LinkIcon, Users, Clock, Euro, Landmark, FileCheck, FileSignature } from 'lucide-react';
import { WorkLog, ProjectInfo } from '@/types/models';
import { 
  extractClientName, 
  extractAddress, 
  extractDescription, 
  extractLinkedProjectId,
  extractHourlyRate,
  extractSignedQuote,
  extractQuoteValue
} from '@/utils/notes-extraction';
import { extractRegistrationTime } from '@/utils/date-helpers';
import { formatNumber } from '@/utils/format-utils';
import BlankSheetHeader from './BlankSheetHeader';
import BlankSheetStats from './BlankSheetStats';

interface BlankSheetContentProps {
  sheet: WorkLog;
  linkedProject: ProjectInfo | null;
}

const BlankSheetContent: React.FC<BlankSheetContentProps> = ({
  sheet,
  linkedProject
}) => {
  const navigate = useNavigate();
  
  const clientName = sheet.clientName || extractClientName(sheet.notes || '');
  const address = sheet.address || extractAddress(sheet.notes || '');
  const description = extractDescription(sheet.notes || '');
  const registrationTime = extractRegistrationTime(sheet.notes || '');
  
  // Use direct properties if available, otherwise extract from notes
  const extractedHourlyRate = extractHourlyRate(sheet.notes || '') || 0;
  const hourlyRate = typeof sheet.hourlyRate === 'number' ? sheet.hourlyRate : extractedHourlyRate;
  const hasHourlyRate = typeof hourlyRate === 'number' && hourlyRate > 0;
  
  const signedQuote = sheet.isQuoteSigned === true || extractSignedQuote(sheet.notes || '');
  const extractedQuoteValue = extractQuoteValue(sheet.notes || '') || 0;
  const quoteValue = typeof sheet.signedQuoteAmount === 'number' ? sheet.signedQuoteAmount : extractedQuoteValue;
  const hasQuoteValue = typeof quoteValue === 'number' && quoteValue > 0;
  const hasSignature = !!sheet.clientSignature;
  
  // Calculate the total cost (hours × hourly rate × number of people)
  const totalHours = sheet.timeTracking?.totalHours || 0;
  const personnelCount = sheet.personnel?.length || 1;
  // Ensure all values in calculation are numbers
  const calcTotalHours = typeof totalHours === 'number' ? totalHours : parseFloat(totalHours as string) || 0;
  const totalCost = calcTotalHours * hourlyRate * personnelCount;

  // Helper function to ensure numbers for formatting
  const formatNumberValue = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return parseFloat(value || '0').toFixed(2);
  };

  const handleClick = () => {
    navigate(`/worklogs/${sheet.id}`);
  };

  return (
    <div className="flex-1 cursor-pointer" onClick={handleClick}>
      <BlankSheetHeader 
        clientName={clientName} 
        projectId={sheet.projectId} 
        date={sheet.date}
        registrationTime={registrationTime}
      />
      
      {linkedProject && (
        <div className="flex items-center text-sm text-primary mb-1">
          <LinkIcon className="h-3 w-3 mr-1" />
          <span>Associée au projet: {linkedProject.name}</span>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mb-1">
        {address || "Adresse non spécifiée"}
      </p>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
      )}
      
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{personnelCount} personnel</span>
        </div>
        
        <div className="flex flex-wrap gap-1 ml-2">
          {sheet.personnel && sheet.personnel.slice(0, 3).map((person, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {person}
            </Badge>
          ))}
          {sheet.personnel && sheet.personnel.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{sheet.personnel.length - 3} autres
            </Badge>
          )}
        </div>
      </div>
      
      <BlankSheetStats 
        hourlyRate={hourlyRate}
        hasHourlyRate={hasHourlyRate}
        totalHours={calcTotalHours}
        personnelCount={personnelCount}
        totalCost={totalCost}
        quoteValue={quoteValue as number}
        hasQuoteValue={hasQuoteValue}
        signedQuote={signedQuote}
        hasSignature={hasSignature}
        formatNumberValue={formatNumberValue}
      />
    </div>
  );
};

export default BlankSheetContent;
