
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { formSchema } from './schema';

type FormValues = z.infer<typeof formSchema>;

interface NotesSectionProps {
  register: UseFormRegister<FormValues>;
  errors: Record<string, any>;
}

const NotesSection: React.FC<NotesSectionProps> = ({ register, errors }) => {
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
