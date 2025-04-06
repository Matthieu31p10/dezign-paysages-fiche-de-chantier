
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Tag, Package, Store, X } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Consumable {
  supplier: string;
  product: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const EmptyConsumable: Consumable = {
  supplier: '',
  product: '',
  unit: '',
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0
};

const ConsumablesSection: React.FC = () => {
  const { control, watch, setValue, getValues } = useFormContext<BlankWorkSheetValues>();
  const [newConsumable, setNewConsumable] = useState<Consumable>({...EmptyConsumable});
  
  const consumables = watch('consumables') || [];
  
  const handleAddConsumable = () => {
    // Calculer le prix total
    const totalPrice = newConsumable.quantity * newConsumable.unitPrice;
    const consumableToAdd = {
      ...newConsumable,
      totalPrice
    };
    
    const updatedConsumables = [...consumables, consumableToAdd];
    setValue('consumables', updatedConsumables);
    
    // Réinitialiser le formulaire
    setNewConsumable({...EmptyConsumable});
  };
  
  const handleRemoveConsumable = (index: number) => {
    const updatedConsumables = [...consumables];
    updatedConsumables.splice(index, 1);
    setValue('consumables', updatedConsumables);
  };

  const updateNewConsumable = (field: keyof Consumable, value: string | number) => {
    setNewConsumable(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculer le prix total lors de la mise à jour de la quantité ou du prix unitaire
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }
      
      return updated;
    });
  };
  
  // Calculer le total des consommables
  const totalConsumablesCost = consumables.reduce((total, item) => total + item.totalPrice, 0);
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Package className="w-5 h-5 mr-2 text-muted-foreground" />
        Consommables
      </h2>
      
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
              <FormItem>
                <FormLabel>Fournisseur</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Store className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input 
                      placeholder="Fournisseur"
                      value={newConsumable.supplier}
                      onChange={(e) => updateNewConsumable('supplier', e.target.value)}
                    />
                  </div>
                </FormControl>
              </FormItem>
              
              <FormItem>
                <FormLabel>Produit</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Produit"
                    value={newConsumable.product}
                    onChange={(e) => updateNewConsumable('product', e.target.value)}
                    required
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
                      value={newConsumable.unit}
                      onChange={(e) => updateNewConsumable('unit', e.target.value)}
                      required
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
                    value={newConsumable.quantity}
                    onChange={(e) => updateNewConsumable('quantity', parseFloat(e.target.value) || 0)}
                    required
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
                    value={newConsumable.unitPrice}
                    onChange={(e) => updateNewConsumable('unitPrice', parseFloat(e.target.value) || 0)}
                    required
                  />
                </FormControl>
              </FormItem>
              
              <div className="flex items-end">
                <Button 
                  type="button" 
                  onClick={handleAddConsumable}
                  disabled={!newConsumable.product || !newConsumable.unit || newConsumable.quantity <= 0}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
            
            {consumables.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Unité</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unit.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consumables.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice.toFixed(2)} €</TableCell>
                        <TableCell>{item.totalPrice.toFixed(2)} €</TableCell>
                        <TableCell>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive" 
                            onClick={() => handleRemoveConsumable(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {consumables.length > 0 && (
              <div className="flex justify-end">
                <div className="bg-muted p-2 rounded-md text-right">
                  <span className="font-semibold">Total des consommables: </span>
                  <span>{totalConsumablesCost.toFixed(2)} €</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumablesSection;
