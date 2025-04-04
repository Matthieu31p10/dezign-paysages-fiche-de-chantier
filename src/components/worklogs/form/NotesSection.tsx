
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkLogForm } from './WorkLogFormContext';

const NotesSection: React.FC = () => {
  const { form } = useWorkLogForm();
  const { register, formState: { errors } } = form;
  
  return (
    <div>
      <Label htmlFor="notes">Notes et observations</Label>
      <Textarea id="notes" placeholder="Ajouter des notes ici..."
        {...register("notes")}
      />
      {errors.notes && (
        <p className="text-sm text-red-500">{errors.notes.message}</p>
      )}
    </div>
  );
};

export default NotesSection;
