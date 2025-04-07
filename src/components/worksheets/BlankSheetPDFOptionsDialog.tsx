
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FileText, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkLog } from '@/types/models';
import { PDFData, PDFOptions } from '@/utils/pdf/types';
import { generatePDF } from '@/utils/pdf';
import { useApp } from '@/context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  extractLinkedProjectId, 
  extractVatRate, 
  extractHourlyRate, 
  extractSignedQuote
} from '@/utils/helpers';
import { useProjects } from '@/context/ProjectsContext';
import { Input } from '@/components/ui/input';

interface BlankSheetPDFOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workLog: WorkLog | null;
}

const BlankSheetPDFOptionsDialog: React.FC<BlankSheetPDFOptionsDialogProps> = ({
  open,
  onOpenChange,
  workLog
}) => {
  const { settings } = useApp();
  const { getActiveProjects, getProjectById } = useProjects();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Options d'export PDF
  const [includeCompanyInfo, setIncludeCompanyInfo] = useState(true);
  const [includeContactInfo, setIncludeContactInfo] = useState(true);
  const [includePersonnel, setIncludePersonnel] = useState(true);
  const [includeTimeTracking, setIncludeTimeTracking] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeWasteManagement, setIncludeWasteManagement] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeConsumables, setIncludeConsumables] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  
  // Option pour le projet lié et le taux horaire
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [vatRate, setVatRate] = useState<string>("20");
  const [signedQuote, setSignedQuote] = useState<boolean>(false);
  
  // Récupérer les projets actifs
  const activeProjects = getActiveProjects();
  
  // Vérifier si la fiche est déjà liée à un projet et autres infos
  useEffect(() => {
    if (workLog?.notes) {
      const linkedProjectId = extractLinkedProjectId(workLog.notes);
      if (linkedProjectId) {
        setSelectedProjectId(linkedProjectId);
      } else {
        setSelectedProjectId(null);
      }
      
      // Récupérer d'autres informations depuis les notes
      const extractedVatRate = extractVatRate(workLog.notes);
      setVatRate(extractedVatRate);
      
      const extractedHourlyRate = extractHourlyRate(workLog.notes);
      setHourlyRate(extractedHourlyRate);
      
      const extractedSignedQuote = extractSignedQuote(workLog.notes);
      setSignedQuote(extractedSignedQuote);
    }
  }, [workLog]);
  
  const handleGeneratePDF = async () => {
    if (!workLog) return;
    
    setIsGenerating(true);
    
    try {
      // Création des options d'export
      const pdfOptions: PDFOptions = {
        includeCompanyInfo,
        includeContactInfo,
        includePersonnel,
        includeTimeTracking,
        includeTasks,
        includeWasteManagement,
        includeNotes,
        includeConsumables,
        includeSummary
      };
      
      // Récupération du projet lié (si sélectionné)
      const project = selectedProjectId ? getProjectById(selectedProjectId) : undefined;
      
      // Création des données pour le PDF
      const pdfData: PDFData = {
        workLog,
        project,
        companyInfo: settings.companyInfo,
        companyLogo: settings.companyLogo,
        pdfOptions,
        linkedProjectId: selectedProjectId || undefined,
        hourlyRate,
        vatRate: vatRate === "10" ? 10 : 20,
        signedQuote,
        consumables: workLog.consumables
      };
      
      // Génération du PDF
      await generatePDF(pdfData);
      
      // Fermer la boîte de dialogue
      onOpenChange(false);
      
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Options d'exportation PDF
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Projet associé */}
          <div className="space-y-3">
            <Label>Associer à un projet</Label>
            <Select
              value={selectedProjectId || "none"}
              onValueChange={(value) => setSelectedProjectId(value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un projet (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun projet</SelectItem>
                {activeProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tarification */}
          <div className="space-y-3">
            <Label>Options de facturation</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourly-rate">Taux horaire (€)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat-rate">Taux de TVA</Label>
                <Select value={vatRate} onValueChange={(value) => setVatRate(value)}>
                  <SelectTrigger id="vat-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="signed-quote" 
                checked={signedQuote} 
                onCheckedChange={(checked) => setSignedQuote(!!checked)} 
              />
              <Label htmlFor="signed-quote" className="font-normal">Devis signé</Label>
            </div>
          </div>
          
          {/* Options d'affichage */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Options d'affichage</Label>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="company-info" 
                  checked={includeCompanyInfo} 
                  onCheckedChange={(checked) => setIncludeCompanyInfo(!!checked)} 
                />
                <Label htmlFor="company-info" className="font-normal">Informations de l'entreprise</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contact-info" 
                  checked={includeContactInfo} 
                  onCheckedChange={(checked) => setIncludeContactInfo(!!checked)} 
                />
                <Label htmlFor="contact-info" className="font-normal">Informations du client</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="personnel" 
                  checked={includePersonnel} 
                  onCheckedChange={(checked) => setIncludePersonnel(!!checked)} 
                />
                <Label htmlFor="personnel" className="font-normal">Personnel</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="time-tracking" 
                  checked={includeTimeTracking} 
                  onCheckedChange={(checked) => setIncludeTimeTracking(!!checked)} 
                />
                <Label htmlFor="time-tracking" className="font-normal">Suivi du temps</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tasks" 
                  checked={includeTasks} 
                  onCheckedChange={(checked) => setIncludeTasks(!!checked)} 
                />
                <Label htmlFor="tasks" className="font-normal">Description des travaux</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consumables" 
                  checked={includeConsumables} 
                  onCheckedChange={(checked) => setIncludeConsumables(!!checked)} 
                />
                <Label htmlFor="consumables" className="font-normal">Consommables</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="waste-management" 
                  checked={includeWasteManagement} 
                  onCheckedChange={(checked) => setIncludeWasteManagement(!!checked)} 
                />
                <Label htmlFor="waste-management" className="font-normal">Gestion des déchets</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notes" 
                  checked={includeNotes} 
                  onCheckedChange={(checked) => setIncludeNotes(!!checked)} 
                />
                <Label htmlFor="notes" className="font-normal">Notes additionnelles</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="summary" 
                  checked={includeSummary} 
                  onCheckedChange={(checked) => setIncludeSummary(!!checked)} 
                />
                <Label htmlFor="summary" className="font-normal">Bilan financier</Label>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleGeneratePDF} 
            className="w-full" 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Générer le PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlankSheetPDFOptionsDialog;
