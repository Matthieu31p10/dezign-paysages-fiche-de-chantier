
import React, { useRef, useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

interface SignatureCanvasProps {
  initialSignature?: string;
  onSignatureChange: (dataUrl: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ 
  initialSignature, 
  onSignatureChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize canvas when component mounts or signature changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas drawing properties
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    
    // Load existing signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Handle both mouse and touch events
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
    
    // Handle both mouse and touch events
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
    
    // Save signature data
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      onSignatureChange(dataURL);
    }
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange('');
  };
  
  return (
    <>
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
      
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={clearSignature}
        >
          <Eraser className="h-4 w-4 mr-2" />
          Effacer
        </Button>
        
        <DialogClose asChild>
          <Button type="button">
            Valider la signature
          </Button>
        </DialogClose>
      </div>
    </>
  );
};

export default SignatureCanvas;
