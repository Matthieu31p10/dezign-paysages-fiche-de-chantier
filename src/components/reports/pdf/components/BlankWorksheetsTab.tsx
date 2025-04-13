
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/utils/helpers';
import { PDFOptions } from '../types';
import PDFOptionsPanel from './PDFOptionsPanel';
import GeneratePDFDialog from './GeneratePDFDialog';
import { useApp } from '@/context/AppContext';
import { extractClientName } from '@/utils/notes-extraction';

interface BlankWorksheetsTabProps {
  selectedWorkLogId: string;
  setSelectedWorkLogId: (id: string) => void;
  pdfOptions: PDFOptions;
  handleOptionChange: (option: keyof PDFOptions, value: boolean) => void;
  handleGeneratePDF: () => void;
}

const BlankWorksheetsTab = ({
  selectedWorkLogId,
  setSelectedWorkLogId,
  pdfOptions,
  handleOptionChange,
  handleGeneratePDF
}: BlankWorksheetsTabProps) => {
  const { workLogs } = useApp();
  
  const blankWorksheets = workLogs.filter(log => {
    return (log.projectId?.startsWith('blank-') || log.projectId?.startsWith('DZFV'));
  });
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="blank-worklog-select">Sélectionner une fiche vierge</Label>
        <Select 
          value={selectedWorkLogId} 
          onValueChange={setSelectedWorkLogId}
        >
          <SelectTrigger id="blank-worklog-select">
            <SelectValue placeholder="Choisir une fiche vierge" />
          </SelectTrigger>
          <SelectContent>
            {blankWorksheets.length === 0 ? (
              <SelectItem value="none" disabled>
                <div className="flex items-center">
                  <span>Aucune fiche vierge disponible</span>
                </div>
              </SelectItem>
            ) : (
              blankWorksheets.map(workLog => {
                const clientName = extractClientName(workLog.notes || '');
                return (
                  <SelectItem key={workLog.id} value={workLog.id}>
                    <div className="flex items-center gap-2">
                      <span>{formatDate(workLog.date)}</span>
                      <span className="font-medium">{clientName || 'Client non spécifié'}</span>
                      <span className="text-muted-foreground text-xs">{workLog.projectId}</span>
                      <span className="ml-auto text-xs">{workLog.personnel?.length || 0} personnels</span>
                    </div>
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </div>
      
      <PDFOptionsPanel 
        options={pdfOptions}
        onChange={handleOptionChange}
        isBlankWorksheet={true}
      />
      
      <GeneratePDFDialog 
        onGenerate={handleGeneratePDF}
        disabled={!selectedWorkLogId || blankWorksheets.length === 0}
        isBlank={true}
      />
    </div>
  );
};

export default BlankWorksheetsTab;
