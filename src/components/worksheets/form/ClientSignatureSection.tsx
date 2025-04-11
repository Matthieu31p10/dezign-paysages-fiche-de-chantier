
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { Pen, Eraser } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';

const ClientSignatureSection = () => {
  const { control, setValue, watch } = useFormContext<BlankWorkSheetValues>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const savedSignature = watch('clientSignature');
  
  // Initialiser le canvas quand le dialogue est ouvert
  useEffect(() => {
    if (!signatureDialogOpen) return;
    
    // Initialiser le canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Définir les propriétés du trait
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    
    // Si une signature existe déjà, la dessiner
    if (savedSignature) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = savedSignature;
    }
  }, [savedSignature, signatureDialogOpen]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Gérer les événements de souris et tactiles
    const rect = canvas.getBoundingClientRect();
    const x = e.type === 'mousedown' 
      ? (e as React.MouseEvent).clientX - rect.left 
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type === 'mousedown' 
      ? (e as React.MouseEvent).clientY - rect.top 
      : (e as React.TouchEvent).touches[0].clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Gérer les événements de souris et tactiles
    const rect = canvas.getBoundingClientRect();
    const x = e.type === 'mousemove' 
      ? (e as React.MouseEvent).clientX - rect.left 
      : (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = e.type === 'mousemove' 
      ? (e as React.MouseEvent).clientY - rect.top 
      : (e as React.TouchEvent).touches[0].clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    
    // Sauvegarder la signature dans le formulaire
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      setValue('clientSignature', dataURL);
    }
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    setValue('clientSignature', '');
  };
  
  const saveSignature = () => {
    // Déjà sauvegardé par stopDrawing, fermer juste le dialogue
    setSignatureDialogOpen(false);
  };
  
  return (
    <FormField
      control={control}
      name="clientSignature"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Pen className="h-4 w-4" />
                Signature du client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormLabel className="text-sm">
                Veuillez faire signer le client ci-dessous:
              </FormLabel>
              
              <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
                <div className="flex flex-col items-center mt-3">
                  {savedSignature ? (
                    <div className="border rounded-md p-3 w-full">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Signature enregistrée</p>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pen className="h-3.5 w-3.5 mr-1.5" />
                            Modifier
                          </Button>
                        </DialogTrigger>
                      </div>
                      <div className="bg-white rounded border p-2">
                        <img 
                          src={savedSignature} 
                          alt="Signature du client" 
                          className="max-h-24 max-w-full mx-auto" 
                        />
                      </div>
                    </div>
                  ) : (
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Pen className="h-4 w-4 mr-2" />
                        Ajouter une signature
                      </Button>
                    </DialogTrigger>
                  )}
                </div>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Signature du client</DialogTitle>
                  </DialogHeader>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-md mt-2 p-1">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={200}
                      className="bg-white w-full touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  
                  <DialogFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearSignature}
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      Effacer
                    </Button>
                    
                    <DialogClose asChild>
                      <Button type="button" onClick={saveSignature}>
                        Valider la signature
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <FormControl>
                <input type="hidden" value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
              </FormControl>
            </CardContent>
          </Card>
        </FormItem>
      )}
    />
  );
};

export default ClientSignatureSection;
