
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useWorkLogDetail } from './WorkLogDetailContext';

const NotesSection: React.FC = () => {
  const { notes, setNotes, handleSaveNotes } = useWorkLogDetail();
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500">Notes et observations</h3>
      <Textarea 
        value={notes} 
        onChange={handleNotesChange} 
        placeholder="Ajoutez vos notes et observations ici..."
        rows={4}
      />
      <Button size="sm" onClick={handleSaveNotes}>Enregistrer les notes</Button>
    </div>
  );
};

export default NotesSection;
