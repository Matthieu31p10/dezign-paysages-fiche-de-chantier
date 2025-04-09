import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FileBarChart, LinkIcon, Euro, FileCheck, 
  Calendar, Tag, FileText, Printer, Download,
  CheckSquare
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
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
  extractRegistrationTime 
} from '@/utils/helpers';
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
  
  const clientName = extractClientName(sheet.notes || '');
  const address = extractAddress(sheet.notes || '');
  const description = extractDescription(sheet.notes || '');
  const registrationTime = extractRegistrationTime(sheet.notes || '');
  const hourlyRate = extractHourlyRate(sheet.notes || '');
  const hasHourlyRate = typeof hourlyRate === 'number' 
    ? hourlyRate > 0
    : parseFloat(hourlyRate || '0') > 0;
  const signedQuote = extractSignedQuote(sheet.notes || '');

  const handleInvoiceToggle = (checked: boolean) => {
    updateWorkLog(sheet.id, { invoiced: checked });
    toast.success(`Fiche ${checked ? 'marquée comme facturée' : 'marquée comme non facturée'}`);
  };

  return (
    <Card className="hover:border-primary/40 transition-all border-l-4 border-l-transparent hover:border-l-primary">
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
              
              <Badge variant="outline" className="ml-auto md:ml-0">
                {formatDate(sheet.date)}
              </Badge>
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
              <div className="flex flex-wrap gap-1">
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
              
              {hasHourlyRate && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Euro className="h-3 w-3" />
                  {(typeof hourlyRate === 'number' 
                    ? hourlyRate 
                    : parseFloat(hourlyRate || '0')).toFixed(2)}€/h
                </Badge>
              )}
              
              {signedQuote && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50">
                  <FileCheck className="h-3 w-3 text-green-600" />
                  Devis signé
                </Badge>
              )}
              
              {registrationTime && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs ml-auto">
                  <Calendar className="h-3 w-3" />
                  {new Date(registrationTime).toLocaleString('fr-FR', { 
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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

            <div className="text-right mr-2">
              <div className="text-sm font-medium">
                {(typeof workLog.timeTracking.totalHours === 'string' 
                  ? Number(workLog.timeTracking.totalHours) 
                  : workLog.timeTracking.totalHours).toFixed(1)} h
              </div>
              <div className="text-xs text-muted-foreground">
                Durée
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
