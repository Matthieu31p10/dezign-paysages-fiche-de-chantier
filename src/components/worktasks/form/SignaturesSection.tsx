
import React, { useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SignaturesSectionProps {
  onSignaturesChange: (clientSig: any, teamLeadSig: any) => void;
}

const SignaturesSection = ({ onSignaturesChange }: SignaturesSectionProps) => {
  const [clientSignature, setClientSignature] = useState<any>(null);
  const [teamLeadSignature, setTeamLeadSignature] = useState<any>(null);

  const clearSignatures = () => {
    if (clientSignature) clientSignature.clear();
    if (teamLeadSignature) teamLeadSignature.clear();
  };

  const handleClientSignatureChange = (ref: any) => {
    setClientSignature(ref);
    onSignaturesChange(ref, teamLeadSignature);
  };

  const handleTeamLeadSignatureChange = (ref: any) => {
    setTeamLeadSignature(ref);
    onSignaturesChange(clientSignature, ref);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signatures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Signature du client</h3>
            <div className="border rounded-md p-1 bg-white">
              <SignatureCanvas
                ref={handleClientSignatureChange}
                canvasProps={{
                  className: 'w-full h-[150px] cursor-crosshair',
                  style: { backgroundColor: '#f8f8f8' }
                }}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Signature du responsable</h3>
            <div className="border rounded-md p-1 bg-white">
              <SignatureCanvas
                ref={handleTeamLeadSignatureChange}
                canvasProps={{
                  className: 'w-full h-[150px] cursor-crosshair',
                  style: { backgroundColor: '#f8f8f8' }
                }}
              />
            </div>
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={clearSignatures}
          className="w-full"
        >
          Effacer les signatures
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignaturesSection;
