
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkLog } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, Link as LinkIcon, FileText, Edit, Trash2, Printer, FileDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlankWorkSheetCardProps {
  sheet: WorkLog;
  clientName: string;
  address: string;
  description: string;
  linkedProject: { id: string; name: string } | null;
  hourlyRate: number;
  signedQuote: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExportPDF: (id: string) => void;
  onPrint: (id: string) => void;
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
  onPrint,
}) => {
  const formattedDate = format(new Date(sheet.date), 'EEEE d MMMM yyyy', { locale: fr });
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {hourlyRate > 0 && (
              <Badge variant="outline" className="font-semibold text-xs">
                {hourlyRate} €/h
              </Badge>
            )}
            {signedQuote && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 text-xs">
                Devis signé
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="font-semibold text-lg truncate">{clientName || "Client non spécifié"}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{sheet.personnel.length} {sheet.personnel.length > 1 ? 'personnes' : 'personne'}</span>
              <Clock className="h-3.5 w-3.5 ml-2" />
              <span>{sheet.timeTracking.totalHours}h</span>
            </div>
          </div>
          
          {address && (
            <div className="flex items-start gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </div>
          )}
          
          {linkedProject && (
            <div className="flex items-center gap-1 text-sm">
              <LinkIcon className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-blue-600">Chantier lié: {linkedProject.name}</span>
            </div>
          )}
          
          {description && (
            <div className="mt-3">
              <div className="flex items-center gap-1 text-sm font-medium mb-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Description</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex flex-wrap justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onExportPDF(sheet.id)}
              >
                <FileDown className="h-4 w-4" />
                <span className="sr-only">Exporter en PDF</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exporter en PDF</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPrint(sheet.id)}
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only">Imprimer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Imprimer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0" 
                onClick={() => onEdit(sheet.id)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Modifier</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modifier</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(sheet.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Supprimer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default BlankWorkSheetCard;
