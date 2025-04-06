
import React from 'react';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Store, Tag } from 'lucide-react';
import { ConsumableFormState } from './types';
import { toast } from 'sonner';

interface ConsumableFormProps {
  consumable: ConsumableFormState;
  updateConsumable: (field: keyof ConsumableFormState, value: string | number) => void;
  onAdd: () => void;
}

const ConsumableForm: React.FC<ConsumableFormProps> = ({ 
  consumable, 
  updateConsumable, 
  onAdd 
}) => {
  const handleAddConsumable = () => {
    // Skip validation if all fields are empty - allows adding empty consumables
    if (!consumable.supplier && !consumable.product && !consumable.unit && 
        consumable.quantity <= 0 && consumable.unitPrice <= 0) {
      return;
    }
    
    // If at least one field is filled, require product and unit at minimum
    if (!consumable.product || !consumable.unit) {
      toast.error("Le produit et l'unité sont requis");
      return;
    }
    
    onAdd();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
      <FormItem>
        <FormLabel>Fournisseur</FormLabel>
        <FormControl>
          <div className="flex items-center">
            <Store className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input 
              placeholder="Fournisseur"
              value={consumable.supplier}
              onChange={(e) => updateConsumable('supplier', e.target.value)}
            />
          </div>
        </FormControl>
      </FormItem>
      
      <FormItem>
        <FormLabel>Produit</FormLabel>
        <FormControl>
          <Input 
            placeholder="Produit"
            value={consumable.product}
            onChange={(e) => updateConsumable('product', e.target.value)}
          />
        </FormControl>
      </FormItem>
      
      <FormItem>
        <FormLabel>Unité</FormLabel>
        <FormControl>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input 
              placeholder="Unité"
              value={consumable.unit}
              onChange={(e) => updateConsumable('unit', e.target.value)}
            />
          </div>
        </FormControl>
      </FormItem>
      
      <FormItem>
        <FormLabel>Quantité</FormLabel>
        <FormControl>
          <Input 
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0"
            value={consumable.quantity}
            onChange={(e) => updateConsumable('quantity', parseFloat(e.target.value) || 0)}
          />
        </FormControl>
      </FormItem>
      
      <FormItem>
        <FormLabel>Prix unitaire (€)</FormLabel>
        <FormControl>
          <Input 
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={consumable.unitPrice}
            onChange={(e) => updateConsumable('unitPrice', parseFloat(e.target.value) || 0)}
          />
        </FormControl>
      </FormItem>
      
      <div className="flex items-end">
        <Button 
          type="button" 
          onClick={handleAddConsumable}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default ConsumableForm;
