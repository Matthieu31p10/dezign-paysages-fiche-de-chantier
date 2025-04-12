
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { BlankWorkSheetValues } from '../schema';
import { Pen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SignatureCanvas from './signature/SignatureCanvas';
import SignatureDisplay from './signature/SignatureDisplay';

const ClientSignatureSection = () => {
  const { control, setValue, watch } = useFormContext<BlankWorkSheetValues>();
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const savedSignature = watch('clientSignature');
  
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
                  <SignatureDisplay signature={savedSignature} />
                </div>
                
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Signature du client</DialogTitle>
                  </DialogHeader>
                  
                  <SignatureCanvas
                    initialSignature={savedSignature}
                    onSignatureChange={(dataUrl) => {
                      setValue('clientSignature', dataUrl);
                    }}
                  />
                </DialogContent>
              </Dialog>
              
              <FormControl>
                <input 
                  type="hidden" 
                  value={field.value || ''} 
                  onChange={(e) => field.onChange(e.target.value)} 
                />
              </FormControl>
            </CardContent>
          </Card>
        </FormItem>
      )}
    />
  );
};

export default ClientSignatureSection;
