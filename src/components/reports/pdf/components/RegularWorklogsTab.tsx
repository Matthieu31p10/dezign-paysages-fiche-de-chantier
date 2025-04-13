
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/utils/helpers';
import { PDFOptions } from '../types';
import PDFOptionsPanel from './PDFOptionsPanel';
import GeneratePDFDialog from './GeneratePDFDialog';
import { useApp } from '@/context/AppContext';

interface RegularWorklogsTabProps {
  selectedWorkLogId: string;
  setSelectedWorkLogId: (id: string) => void;
  pdfOptions: PDFOptions;
  handleOptionChange: (option: keyof PDFOptions, value: boolean) => void;
  handleGeneratePDF: () => void;
}

const RegularWorklogsTab = ({
  selectedWorkLogId,
  setSelectedWorkLogId,
  pdfOptions,
  handleOptionChange,
  handleGeneratePDF
}: RegularWorklogsTabProps) => {
  const { workLogs, getProjectById } = useApp();
  
  const regularWorkLogs = workLogs.filter(log => {
    const project = getProjectById(log.projectId);
    return project && log.personnel && log.personnel.length > 0 && 
      (!log.projectId.startsWith('blank-') && !log.projectId.startsWith('DZFV'));
  });
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="worklog-select">Sélectionner une fiche de suivi</Label>
        <Select 
          value={selectedWorkLogId} 
          onValueChange={setSelectedWorkLogId}
        >
          <SelectTrigger id="worklog-select">
            <SelectValue placeholder="Choisir une fiche de suivi" />
          </SelectTrigger>
          <SelectContent>
            {regularWorkLogs.length === 0 ? (
              <SelectItem value="none" disabled>Aucune fiche de suivi disponible</SelectItem>
            ) : (
              regularWorkLogs.map(workLog => {
                const project = getProjectById(workLog.projectId);
                return (
                  <SelectItem key={workLog.id} value={workLog.id}>
                    {formatDate(workLog.date)} - {project?.name || 'Chantier inconnu'}
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
        isBlankWorksheet={false}
      />
      
      <GeneratePDFDialog 
        onGenerate={handleGeneratePDF}
        disabled={!selectedWorkLogId || regularWorkLogs.length === 0}
        isBlank={false}
      />
    </div>
  );
};

export default RegularWorklogsTab;
