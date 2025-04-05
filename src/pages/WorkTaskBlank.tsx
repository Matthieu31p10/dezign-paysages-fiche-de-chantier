
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const WorkTaskBlank = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateBlankPDF = async () => {
    setIsLoading(true);
    try {
      // Initialize PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Colors and dimensions
      const margin = 15;
      const pageWidth = 210;
      const contentWidth = pageWidth - (margin * 2);
      
      // Title
      let yPos = margin;
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text("FICHE DE TRAVAUX", pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.text("Date: ___________________", pageWidth / 2, yPos, { align: 'center' });
      
      // Chantier information
      yPos += 15;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Informations du chantier", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Nom du chantier:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("_______________________________", margin + 35, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Adresse:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("_______________________________", margin + 35, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Contact client:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("_______________________________", margin + 35, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Client présent:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("☐ Oui    ☐ Non", margin + 35, yPos);
      
      // Personnel section
      yPos += 12;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Personnel présent", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      for (let i = 0; i < 5; i++) {
        pdf.text(`☐ _______________________________`, margin + 5, yPos);
        yPos += 6;
      }
      
      // Time tracking section
      yPos += 5;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Suivi du temps", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      
      const timeColumns = ['Départ', 'Arrivée', 'Fin', 'Pause'];
      const timeData = Array(1).fill(Array(4).fill('____________'));
      
      pdf.autoTable({
        startY: yPos,
        head: [timeColumns],
        body: timeData,
        theme: 'grid',
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
        margin: { left: margin, right: margin },
      });
      
      yPos = (pdf as any).lastAutoTable.finalY + 5;
      
      // Cost calculation
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Temps de déplacement:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("____________ h", margin + 50, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Temps de travail:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("____________ h", margin + 50, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Temps total:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("____________ h", margin + 50, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Taux horaire:", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.text("____________ €/h", margin + 50, yPos);
      
      // Custom tasks
      yPos += 12;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Tâches personnalisées", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      for (let i = 0; i < 4; i++) {
        pdf.text(`☐ _______________________________`, margin + 5, yPos);
        pdf.text(`Progression: ____ %`, margin + 100, yPos);
        yPos += 6;
      }
      
      // Waste management
      yPos += 5;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Gestion des déchets", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      pdf.text("☐ Déchets emportés", margin + 5, yPos);
      pdf.text("☐ Déchets laissés sur place", margin + 80, yPos);
      
      yPos += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text("Détails:", margin + 5, yPos);
      
      yPos += 6;
      pdf.setDrawColor(150, 150, 150);
      for (let i = 0; i < 3; i++) {
        pdf.line(margin + 5, yPos, pageWidth - margin, yPos);
        yPos += 5;
      }
      
      // Supplies table
      yPos += 7;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Fournitures", margin, yPos);
      
      yPos += 7;
      
      const suppliesHeaders = [
        'Fournisseur', 'Matériaux', 'Unité', 'Quantité', 'Prix unitaire (€)', 'Prix total (€)'
      ];
      
      const suppliesData = Array(5).fill(Array(6).fill(''));
      
      pdf.autoTable({
        startY: yPos,
        head: [suppliesHeaders],
        body: suppliesData,
        foot: [['', '', '', '', 'Total', '']],
        theme: 'grid',
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
        footStyles: { fillColor: [240, 240, 240] },
        margin: { left: margin, right: margin },
      });
      
      yPos = (pdf as any).lastAutoTable.finalY + 5;
      
      // Cost summary
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Récapitulatif des coûts", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.text("Main d'œuvre:", margin + 5, yPos);
      pdf.text("____________ €", contentWidth, yPos, { align: 'right' });
      
      yPos += 6;
      pdf.text("Fournitures:", margin + 5, yPos);
      pdf.text("____________ €", contentWidth, yPos, { align: 'right' });
      
      yPos += 2;
      pdf.setDrawColor(150, 150, 150);
      pdf.line(margin + 5, yPos + 2, pageWidth - margin, yPos + 2);
      
      yPos += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.text("TOTAL:", margin + 5, yPos);
      pdf.text("____________ €", contentWidth, yPos, { align: 'right' });
      
      // Notes
      yPos = Math.min(yPos + 12, 180);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Notes et observations", margin, yPos);
      
      yPos += 7;
      pdf.setDrawColor(150, 150, 150);
      for (let i = 0; i < 5; i++) {
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;
      }
      
      // Signatures
      yPos = Math.min(yPos + 12, 230);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Signatures", margin, yPos);
      
      yPos += 7;
      pdf.setFontSize(10);
      
      // Calculate signature box width and height
      const signWidth = (contentWidth - 10) / 2;
      const signHeight = 30;
      
      // Client signature
      pdf.setFont('helvetica', 'normal');
      pdf.text("Signature client:", margin + 5, yPos);
      
      yPos += 5;
      pdf.rect(margin + 5, yPos, signWidth, signHeight);
      
      // Team signature
      pdf.text("Signature responsable:", margin + signWidth + 15, yPos - 5);
      pdf.rect(margin + signWidth + 15, yPos, signWidth, signHeight);
      
      // Save PDF
      const fileName = `Fiche_Travaux_Vierge.pdf`;
      pdf.save(fileName);
      
      toast.success("Fiche de travaux vierge générée avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF vierge:", error);
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 mr-2"
            onClick={() => navigate('/worktasks')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-semibold">Fiche de travaux vierge</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Générer une fiche de travaux vierge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Générez une fiche de travaux vierge à imprimer pour utilisation sur le terrain.
          </p>
          
          <Button 
            onClick={handleGenerateBlankPDF}
            disabled={isLoading}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? "Génération en cours..." : "Générer une fiche vierge"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkTaskBlank;
