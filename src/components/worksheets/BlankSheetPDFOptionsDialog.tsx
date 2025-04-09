import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface BlankSheetPDFOptionsDialogProps {
  onGenerate: (percentage: number) => void;
}

const BlankSheetPDFOptionsDialog: React.FC<BlankSheetPDFOptionsDialogProps> = ({ onGenerate }) => {
  const [open, setOpen] = useState(false);
  const [percentage, setPercentage] = useState(100);

  const handleGenerate = () => {
    onGenerate(percentage);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Options PDF</Button>
      </AlertDialogTrigger>
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
            <Input type="number" id="printPercentage" value={percentage.toString()} className="col-span-3" onChange={(e) => setPercentage(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slider">Ajuster le pourcentage</Label>
            <Slider
              id="slider"
              defaultValue={[100]}
              max={100}
              min={1}
              step={1}
              onValueChange={(value) => setPercentage(value[0])}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleGenerate}>Générer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlankSheetPDFOptionsDialog;
