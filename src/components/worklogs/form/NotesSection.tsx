
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkLogForm } from './WorkLogFormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotesSection: React.FC = () => {
  const { form } = useWorkLogForm();
  const { register, formState: { errors } } = form;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Notes et observations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Ajoutez vos remarques ou observations concernant cette visite
          </Label>
          <Textarea 
            id="notes" 
            placeholder="Ajouter des notes ici..." 
            className="min-h-[120px] resize-y"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-sm text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesSection;
