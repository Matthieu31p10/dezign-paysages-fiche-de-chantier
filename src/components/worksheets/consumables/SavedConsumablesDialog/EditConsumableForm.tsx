
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ConsumableFormState } from '../types';

interface EditConsumableFormProps {
  editingConsumable: ConsumableFormState;
  onUpdateField: (field: keyof ConsumableFormState, value: string | number) => void;
  onSave: () => void;
}

const EditConsumableForm: React.FC<EditConsumableFormProps> = ({
  editingConsumable,
  onUpdateField,
  onSave
}) => {
  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-medium mb-2">Modifier le consommable</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <FormLabel>Fournisseur</FormLabel>
          <Input
            value={editingConsumable.supplier || ''}
            onChange={(e) => onUpdateField('supplier', e.target.value)}
            placeholder="Fournisseur"
          />
        </div>
        <div>
          <FormLabel>Produit</FormLabel>
          <Input
            value={editingConsumable.product}
            onChange={(e) => onUpdateField('product', e.target.value)}
            placeholder="Produit"
          />
        </div>
        <div>
          <FormLabel>Unité</FormLabel>
          <Input
            value={editingConsumable.unit}
            onChange={(e) => onUpdateField('unit', e.target.value)}
            placeholder="Unité"
          />
        </div>
        <div>
          <FormLabel>Quantité</FormLabel>
          <Input
            type="number"
            value={editingConsumable.quantity}
            onChange={(e) => onUpdateField('quantity', parseFloat(e.target.value) || 0)}
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
            onChange={(e) => onUpdateField('unitPrice', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={onSave}>
          <Check className="w-4 h-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default EditConsumableForm;
