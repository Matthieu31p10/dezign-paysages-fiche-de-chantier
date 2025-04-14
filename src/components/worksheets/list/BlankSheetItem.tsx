
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FileBarChart, LinkIcon, Euro, FileCheck, FileSignature,
  Calendar, Tag, FileText, Printer, Download, Landmark, Users, Clock
} from 'lucide-react';
import { formatDate } from '@/utils/date';
import { formatNumber } from '@/utils/format-utils';
import { WorkLog } from '@/types/models';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
import { ProjectInfo } from '@/types/models';
import { toast } from 'sonner';
import { useWorkLogs } from '@/context/WorkLogsContext';

interface BlankSheetItemProps {
  sheet: WorkLog;
  linkedProject: ProjectInfo | null;
  onEdit: (id: string) => void;
  onExportPDF: (id: string) => void;
  onPrint: (id: string) => void;
}

const BlankSheetItem: React.FC<BlankSheetItemProps> = ({
  sheet,
  linkedProject,
  onEdit,
  onExportPDF,
  onPrint
}) => {
  const navigate = useNavigate();
  const { updateWorkLog } = useWorkLogs();
  
  const clientName = sheet.clientName || extractClientName(sheet.notes || '');
  const address = sheet.address || extractAddress(sheet.notes || '');
  const description = extractDescription(sheet.notes || '');
  const registrationTime = extractRegistrationTime(sheet.notes || '');
  
  // Use direct properties if available, otherwise extract from notes
  const extractedHourlyRate = extractHourlyRate(sheet.notes || '') || 0;
  const hourlyRate = typeof sheet.hourlyRate === 'number' ? sheet.hourlyRate : extractedHourlyRate;
  const hasHourlyRate = typeof hourlyRate === 'number' && hourlyRate > 0;
  
  const signedQuote = sheet.isQuoteSigned || extractSignedQuote(sheet.notes || '');
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

  const handleInvoiceToggle = (checked: boolean) => {
    updateWorkLog(sheet.id, { invoiced: checked });
    toast.success(`Fiche ${checked ? 'marquée comme facturée' : 'marquée comme non facturée'}`);
  };

  // Helper function to ensure numbers for formatting
  const formatNumberValue = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return parseFloat(value || '0').toFixed(2);
  };

  return (
    <Card className={`hover:border-primary/40 transition-all border-l-4 ${sheet.invoiced ? 'border-l-green-500' : 'border-l-amber-500'} hover:border-l-primary`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => navigate(`/worklogs/${sheet.id}`)}>
            <div className="flex items-center gap-2 mb-1.5">
              <FileBarChart className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{clientName || "Client non spécifié"}</h3>
              
              {sheet.projectId && sheet.projectId.startsWith('DZFV') && (
                <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {sheet.projectId}
                </Badge>
              )}
              
              <Badge variant="outline" className="ml-auto md:ml-0 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(sheet.date)}
              </Badge>
              
              {registrationTime && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {new Date(registrationTime).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Badge>
              )}
            </div>
            
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
                {sheet.personnel.slice(0, 3).map((person, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {person}
                  </Badge>
                ))}
                {sheet.personnel.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{sheet.personnel.length - 3} autres
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {hasHourlyRate && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50">
                  <Euro className="h-3 w-3 text-blue-600" />
                  {formatNumberValue(hourlyRate)}€/h
                </Badge>
              )}
              
              {totalHours > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-violet-50">
                  <Clock className="h-3 w-3 text-violet-600" />
                  {formatNumberValue(calcTotalHours)}h × {personnelCount} = {(calcTotalHours * personnelCount).toFixed(1)}h
                </Badge>
              )}
              
              {hasHourlyRate && totalHours > 0 && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50">
                  <Euro className="h-3 w-3 text-green-600" />
                  Total: {totalCost.toFixed(2)}€
                </Badge>
              )}
              
              {hasQuoteValue && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-blue-50">
                  <Landmark className="h-3 w-3 text-blue-600" />
                  Devis: {formatNumber(quoteValue as number)}€ HT
                </Badge>
              )}
              
              {signedQuote && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50">
                  <FileCheck className="h-3 w-3 text-green-600" />
                  Devis signé
                </Badge>
              )}
              
              {hasSignature && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-amber-50">
                  <FileSignature className="h-3 w-3 text-amber-600" />
                  Signature client
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <div className="flex items-center gap-2 mr-2">
              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  id={`invoiced-${sheet.id}`}
                  checked={sheet.invoiced || false}
                  onCheckedChange={handleInvoiceToggle}
                  className="h-4 w-4 data-[state=checked]:bg-green-600"
                />
                <Label 
                  htmlFor={`invoiced-${sheet.id}`}
                  className="text-xs cursor-pointer select-none"
                >
                  Facturée
                </Label>
              </div>
            </div>

            <div className="text-right mr-2 bg-muted/30 px-3 py-1 rounded-md">
              <div className="text-sm font-medium">
                {formatNumberValue(calcTotalHours)} h
              </div>
              <div className="text-xs text-muted-foreground">
                {personnelCount > 1 ? `× ${personnelCount} = ${(calcTotalHours * personnelCount).toFixed(1)}h` : 'Durée'}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExportPDF(sheet.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter en PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPrint(sheet.id)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => onEdit(sheet.id)}
            >
              Modifier
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlankSheetItem;
