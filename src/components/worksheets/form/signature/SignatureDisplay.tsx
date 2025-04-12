
import React from 'react';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

interface SignatureDisplayProps {
  signature?: string;
}

const SignatureDisplay: React.FC<SignatureDisplayProps> = ({ signature }) => {
  if (!signature) {
    return (
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Pen className="h-4 w-4 mr-2" />
          Ajouter une signature
        </Button>
      </DialogTrigger>
    );
  }
  
  return (
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
          src={signature} 
          alt="Signature du client" 
          className="max-h-24 max-w-full mx-auto" 
        />
      </div>
    </div>
  );
};

export default SignatureDisplay;
