
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface BlankSheetPDFOptionsDialogProps {
  onOpenChange: (isOpen: boolean) => void;
  onExport: (options: any) => Promise<void>;
  isLoading: boolean;
}

const BlankSheetPDFOptionsDialog: React.FC<BlankSheetPDFOptionsDialogProps> = ({ 
  onOpenChange, 
  onExport,
  isLoading
}) => {
  const [percentage, setPercentage] = React.useState(100);

  const handleGenerate = () => {
    onExport({
      includeCompanyHeader: true,
      includeClientInfo: true,
      includeSignature: true,
      scale: percentage / 100
    });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Options de génération PDF</AlertDialogTitle>
        <AlertDialogDescription>
          Ajustez les paramètres pour la génération du PDF.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="printPercentage" className="text-right">
            Pourcentage d'impression
          </Label>
          <Input 
            type="number" 
            id="printPercentage" 
            value={percentage.toString()} 
            className="col-span-3" 
            onChange={(e) => setPercentage(Number(e.target.value))} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slider">Ajuster le pourcentage</Label>
          <Slider
            id="slider"
            defaultValue={[100]}
            max={100}
            min={1}
            step={1}
            value={[percentage]}
            onValueChange={(value) => setPercentage(value[0])}
          />
        </div>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => onOpenChange(false)}>Annuler</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Génération..." : "Générer"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default BlankSheetPDFOptionsDialog;
