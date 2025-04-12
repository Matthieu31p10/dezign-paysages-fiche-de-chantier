
import { formatDate } from '@/utils/date';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Clock, ClipboardCheck, Trash, Calculator } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';

interface WorksheetSummaryProps {
  formValues: BlankWorkSheetValues;
  projectName?: string | null;
}

const WorksheetSummary = ({ formValues, projectName }: WorksheetSummaryProps) => {
  // Calculate total hours worked
  const totalHours = formValues.totalHours || 0;
  const personnelCount = formValues.personnel?.length || 1;
  const totalTeamHours = totalHours * personnelCount;
  const totalAmount = totalTeamHours * (formValues.hourlyRate || 0);
  
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Résumé
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project link */}
        {projectName && (
          <div className="border rounded-md p-3 bg-muted/50">
            <p className="text-sm font-medium">Chantier associé</p>
            <p className="text-sm">{projectName}</p>
          </div>
        )}
        
        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Date d'intervention</p>
            <p className="text-sm">
              {formValues.date ? formatDate(formValues.date) : 'Non spécifiée'}
            </p>
          </div>
        </div>
        
        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Temps de travail</p>
            <div className="text-sm grid grid-cols-2 gap-1">
              <span>Personnel:</span> 
              <span className="font-medium">{totalHours.toFixed(2)}h</span>
              
              <span>Équipe ({personnelCount} pers.):</span> 
              <span className="font-medium">{totalTeamHours.toFixed(2)}h</span>
              
              {formValues.hourlyRate > 0 && (
                <>
                  <span>Total:</span> 
                  <span className="font-medium">{totalAmount.toFixed(2)}€</span>
                </>
              )}
            </div>
            {formValues.arrival && formValues.end && (
              <p className="text-xs text-muted-foreground mt-1">
                {formValues.arrival} - {formValues.end}
              </p>
            )}
          </div>
        </div>
        
        {/* Personnel */}
        <div className="flex items-start gap-3">
          <ClipboardCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Personnel</p>
            {formValues.personnel && formValues.personnel.length > 0 ? (
              <ul className="text-sm list-disc list-inside">
                {formValues.personnel.map((personId) => (
                  <li key={personId}>{personId}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun personnel sélectionné</p>
            )}
          </div>
        </div>
        
        {/* Waste Management */}
        {formValues.wasteManagement && formValues.wasteManagement !== 'none' && (
          <div className="flex items-start gap-3">
            <Trash className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Gestion des déchets</p>
              <p className="text-sm">
                {formValues.wasteManagement.startsWith('big_bag') && 'Big-bag'}
                {formValues.wasteManagement.startsWith('half_dumpster') && '½ Benne'}
                {formValues.wasteManagement.startsWith('dumpster') && 'Benne'}
                {' - '}
                {formValues.wasteManagement.split('_')[1] || '1'} unité(s)
              </p>
            </div>
          </div>
        )}
        
        {/* Client info */}
        {formValues.clientName && (
          <div className="border-t pt-3 mt-3">
            <p className="text-sm font-medium">Client</p>
            <p className="text-sm">{formValues.clientName}</p>
            {formValues.address && <p className="text-xs text-muted-foreground">{formValues.address}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorksheetSummary;
