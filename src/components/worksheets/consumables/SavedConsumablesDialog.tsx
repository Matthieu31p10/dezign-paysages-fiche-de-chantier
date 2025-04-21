
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, X, Check } from 'lucide-react';
import { Consumable } from '@/types/models';
import { ConsumableFormState } from './types';

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
  const [editingConsumable, setEditingConsumable] = useState<ConsumableFormState>({
    supplier: '',
    product: '',
    unit: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  });

  const handleStartEditSavedConsumable = (index: number) => {
    setSelectedConsumableIndex(index);
    const consumable = savedConsumables[index];
    setEditingConsumable({
      supplier: consumable.supplier || '', // Add default empty string for optional supplier
      product: consumable.product,
      unit: consumable.unit,
      quantity: consumable.quantity,
      unitPrice: consumable.unitPrice,
      totalPrice: consumable.totalPrice
    });
    setEditMode(true);
  };
  
  const handleSaveEditedConsumable = () => {
    if (selectedConsumableIndex === null) return;
    
    // Calculate total price
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
    setEditingConsumable({
      supplier: '',
      product: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    });
  };

  const updateEditingConsumable = (field: keyof ConsumableFormState, value: string | number) => {
    setEditingConsumable(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate total price when quantity or unit price changes
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
        
        {savedConsumables.length > 0 ? (
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead>Qté</TableHead>
                  <TableHead>Prix unit.</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedConsumables.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)} €</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onLoad(item)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStartEditSavedConsumable(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive" 
                          onClick={() => onRemove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Aucun consommable sauvegardé</p>
          </div>
        )}
        
        {editMode && selectedConsumableIndex !== null && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Modifier le consommable</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <FormLabel>Fournisseur</FormLabel>
                <Input
                  value={editingConsumable.supplier || ''}
                  onChange={(e) => updateEditingConsumable('supplier', e.target.value)}
                  placeholder="Fournisseur"
                />
              </div>
              <div>
                <FormLabel>Produit</FormLabel>
                <Input
                  value={editingConsumable.product}
                  onChange={(e) => updateEditingConsumable('product', e.target.value)}
                  placeholder="Produit"
                />
              </div>
              <div>
                <FormLabel>Unité</FormLabel>
                <Input
                  value={editingConsumable.unit}
                  onChange={(e) => updateEditingConsumable('unit', e.target.value)}
                  placeholder="Unité"
                />
              </div>
              <div>
                <FormLabel>Quantité</FormLabel>
                <Input
                  type="number"
                  value={editingConsumable.quantity}
                  onChange={(e) => updateEditingConsumable('quantity', parseFloat(e.target.value) || 0)}
                  min="0.01"
                  step="0.01"
                  placeholder="0"
                />
              </div>
              <div>
                <FormLabel>Prix unitaire (€)</FormLabel>
                <Input
                  type="number"
                  value={editingConsumable.unitPrice}
                  onChange={(e) => updateEditingConsumable('unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={handleSaveEditedConsumable}>
                <Check className="w-4 h-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </div>
          </div>
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
