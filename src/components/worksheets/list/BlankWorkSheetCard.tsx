
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileBarChart, 
  LinkIcon, 
  Euro, 
  FileCheck, 
  Printer, 
  FileText, 
  Download,
  Trash2
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkLog } from '@/types/models';
import { TooltipProvider } from '@/components/ui/tooltip';

interface BlankWorkSheetCardProps {
  sheet: WorkLog;
  clientName: string;
  address: string;
  description?: string;
  linkedProject?: { id: string; name: string } | null;
  hourlyRate: number;
  signedQuote: boolean;
  onEdit: (sheetId: string) => void;
  onDelete: (sheetId: string) => void;
  onExportPDF: (sheetId: string) => void;
  onPrint: (sheetId: string) => void;
}

const BlankWorkSheetCard: React.FC<BlankWorkSheetCardProps> = ({
  sheet,
  clientName,
  address,
  description,
  linkedProject,
  hourlyRate,
  signedQuote,
  onEdit,
  onDelete,
  onExportPDF,
  onPrint
}) => {
  const navigate = useNavigate();
  const hasHourlyRate = hourlyRate > 0;

  return (
    <Card className="hover:border-primary/40 transition-all border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => navigate(`/worklogs/${sheet.id}`)}>
            <div className="flex items-center gap-2 mb-1.5">
              <FileBarChart className="h-4 w-4 text-primary" />
              <h3 className="font-medium">{clientName || "Client non spécifié"}</h3>
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
                  {hourlyRate.toFixed(2)}€/h
                </Badge>
              )}
              
              {signedQuote && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs bg-green-50">
                  <FileCheck className="h-3 w-3 text-green-600" />
                  Devis signé
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <div className="text-right mr-2">
              <div className="text-sm font-medium">
                {sheet.timeTracking?.totalHours.toFixed(1)} h
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

            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(sheet.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlankWorkSheetCard;
