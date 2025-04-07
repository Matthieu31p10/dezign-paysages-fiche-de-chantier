
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Calculator, Plus, Trash } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { Consumable } from '@/types/models';
import { Separator } from '@/components/ui/separator';

const ConsumablesSection = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BlankWorkSheetValues>();
  const consumables = watch('consumables') || [];
  
  const [newConsumable, setNewConsumable] = useState<{
    supplier: string;
    product: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>({
    supplier: '',
    product: '',
    unit: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  });

  const addConsumable = () => {
    // Validate required fields
    if (newConsumable.product.trim() === '') {
      return; // Don't add if product is empty
    }

    const newList = [...consumables, {
      ...newConsumable,
      // Ensure numeric fields are numbers, not strings
      quantity: Number(newConsumable.quantity) || 1,
      unitPrice: Number(newConsumable.unitPrice) || 0,
      totalPrice: Number(newConsumable.totalPrice) || 0
    }];
    
    setValue('consumables', newList as Consumable[]);
    
    // Reset form
    setNewConsumable({
      supplier: '',
      product: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    });
  };

  const calculateTotal = () => {
    const quantity = Number(newConsumable.quantity) || 0;
    const unitPrice = Number(newConsumable.unitPrice) || 0;
    setNewConsumable({
      ...newConsumable,
      totalPrice: Number((quantity * unitPrice).toFixed(2))
    });
  };

  const removeConsumable = (index: number) => {
    const updatedConsumables = [...consumables];
    updatedConsumables.splice(index, 1);
    setValue('consumables', updatedConsumables);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const quantity = value === '' ? 0 : Number(value);
    setNewConsumable({
      ...newConsumable,
      quantity
    });
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const unitPrice = value === '' ? 0 : Number(value);
    setNewConsumable({
      ...newConsumable,
      unitPrice
    });
  };

  const getTotalAmount = () => {
    return consumables.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Consommables et produits utilisés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 sm:col-span-2">
                <label className="text-sm font-medium">Fournisseur</label>
                <Input
                  placeholder="Fournisseur"
                  value={newConsumable.supplier}
                  onChange={(e) => setNewConsumable({...newConsumable, supplier: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-12 sm:col-span-3">
                <label className="text-sm font-medium">Produit</label>
                <Input
                  placeholder="Produit"
                  value={newConsumable.product}
                  onChange={(e) => setNewConsumable({...newConsumable, product: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-12 sm:col-span-1">
                <label className="text-sm font-medium">Unité</label>
                <Input
                  placeholder="Unité"
                  value={newConsumable.unit}
                  onChange={(e) => setNewConsumable({...newConsumable, unit: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="text-sm font-medium">Quantité</label>
                <Input
                  type="number"
                  min="0.01" 
                  step="0.01"
                  placeholder="Quantité"
                  value={newConsumable.quantity}
                  onChange={handleQuantityChange}
                  className="mt-1"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="text-sm font-medium">Prix Unitaire (€)</label>
                <Input
                  type="number"
                  min="0.01" 
                  step="0.01"
                  placeholder="Prix unitaire"
                  value={newConsumable.unitPrice}
                  onChange={handleUnitPriceChange}
                  className="mt-1"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="flex items-center justify-between text-sm font-medium">
                  <span>Prix Total (€)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={calculateTotal}
                  >
                    <Calculator className="h-3 w-3" />
                  </Button>
                </label>
                <Input
                  type="number"
                  readOnly
                  placeholder="Prix total"
                  value={newConsumable.totalPrice}
                  className="mt-1 bg-muted"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={addConsumable}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
            
            {consumables.length > 0 && (
              <>
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Consommables ajoutés</h4>
                  
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-2 bg-muted text-xs font-medium">
                      <div className="col-span-2">Fournisseur</div>
                      <div className="col-span-3">Produit</div>
                      <div className="col-span-1">Unité</div>
                      <div className="col-span-2 text-center">Quantité</div>
                      <div className="col-span-2 text-center">Prix Unitaire (€)</div>
                      <div className="col-span-2 text-right">Total (€)</div>
                    </div>
                    
                    {consumables.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 p-2 border-t text-sm items-center">
                        <div className="col-span-2 truncate">{item.supplier || '-'}</div>
                        <div className="col-span-3 truncate">{item.product}</div>
                        <div className="col-span-1 truncate">{item.unit || '-'}</div>
                        <div className="col-span-2 text-center">{Number(item.quantity).toFixed(2)}</div>
                        <div className="col-span-2 text-center">{Number(item.unitPrice).toFixed(2)} €</div>
                        <div className="col-span-1 text-right">{Number(item.totalPrice).toFixed(2)} €</div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive"
                            onClick={() => removeConsumable(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-12 gap-2 p-2 border-t bg-muted font-medium">
                      <div className="col-span-10 text-right">Total</div>
                      <div className="col-span-2 text-right">{getTotalAmount().toFixed(2)} €</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumablesSection;
