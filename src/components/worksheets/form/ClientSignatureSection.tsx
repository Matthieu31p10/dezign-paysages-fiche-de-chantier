
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { Pen, Eraser } from 'lucide-react';

const ClientSignatureSection = () => {
  const { control, setValue, watch } = useFormContext<BlankWorkSheetValues>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const savedSignature = watch('clientSignature');
  
  useEffect(() => {
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
  }, [savedSignature]);
  
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
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                >
                  <Eraser className="h-4 w-4 mr-2" />
                  Effacer
                </Button>
              </div>
            </CardContent>
          </Card>
        </FormItem>
      )}
    />
  );
};

export default ClientSignatureSection;
