
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Consumable } from '@/types/models';
import { ConsumableFormState, EmptyConsumable } from '../types';
import SavedConsumablesTable from './SavedConsumablesTable';
import EditConsumableForm from './EditConsumableForm';

interface SavedConsumablesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedConsumables: Consumable[];
  onLoad: (consumable: Consumable) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, consumable: Consumable) => void;
}

const SavedConsumablesDialog: React.FC<SavedConsumablesDialogProps> = ({
  open,
  onOpenChange,
  savedConsumables,
  onLoad,
  onRemove,
  onUpdate
}) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedConsumableIndex, setSelectedConsumableIndex] = useState<number | null>(null);
  const [editingConsumable, setEditingConsumable] = useState<ConsumableFormState>({...EmptyConsumable});

  const handleStartEdit = (index: number) => {
    setSelectedConsumableIndex(index);
    const consumable = savedConsumables[index];
    setEditingConsumable({
      supplier: consumable.supplier || '',
      product: consumable.product,
      unit: consumable.unit,
      quantity: consumable.quantity,
      unitPrice: consumable.unitPrice,
      totalPrice: consumable.totalPrice
    });
    setEditMode(true);
  };
  
  const handleSaveEdit = () => {
    if (selectedConsumableIndex === null) return;
    
    const totalPrice = editingConsumable.quantity * editingConsumable.unitPrice;
    const updatedConsumable: Consumable = { 
      id: savedConsumables[selectedConsumableIndex].id,
      supplier: editingConsumable.supplier,
      product: editingConsumable.product,
      unit: editingConsumable.unit,
      quantity: editingConsumable.quantity,
      unitPrice: editingConsumable.unitPrice,
      totalPrice
    };
    
    onUpdate(selectedConsumableIndex, updatedConsumable);
    
    setEditMode(false);
    setSelectedConsumableIndex(null);
    setEditingConsumable({...EmptyConsumable});
  };

  const updateEditingField = (field: keyof ConsumableFormState, value: string | number) => {
    setEditingConsumable(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }
      
      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Consommables sauvegardés</DialogTitle>
        </DialogHeader>
        
        <SavedConsumablesTable
          savedConsumables={savedConsumables}
          onLoad={onLoad}
          onEdit={handleStartEdit}
          onRemove={onRemove}
        />
        
        {editMode && selectedConsumableIndex !== null && (
          <EditConsumableForm
            editingConsumable={editingConsumable}
            onUpdateField={updateEditingField}
            onSave={handleSaveEdit}
          />
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedConsumablesDialog;
