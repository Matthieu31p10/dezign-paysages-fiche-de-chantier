
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { PlusCircle, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { WorkTaskSupplier } from '@/types/workTask';

const SuppliesSection = () => {
  const form = useFormContext();
  const [supplies, setSupplies] = useState<WorkTaskSupplier[]>(
    form.getValues('supplies') || []
  );

  const handleAddSupply = () => {
    const newSupply: WorkTaskSupplier = {
      supplier: '',
      material: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
    };
    const updatedSupplies = [...supplies, newSupply];
    setSupplies(updatedSupplies);
    form.setValue('supplies', updatedSupplies);
  };

  const handleUpdateSupply = (index: number, field: keyof WorkTaskSupplier, value: any) => {
    const updatedSupplies = [...supplies];
    updatedSupplies[index] = {
      ...updatedSupplies[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value
    };
    setSupplies(updatedSupplies);
    form.setValue('supplies', updatedSupplies);
  };

  const handleRemoveSupply = (index: number) => {
    const updatedSupplies = supplies.filter((_, i) => i !== index);
    setSupplies(updatedSupplies);
    form.setValue('supplies', updatedSupplies);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fournitures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">Fournisseur</th>
                <th className="border p-2 text-left">Matériaux</th>
                <th className="border p-2 text-left">Unité</th>
                <th className="border p-2 text-right">Quantité</th>
                <th className="border p-2 text-right">Prix Unitaire (€)</th>
                <th className="border p-2 text-right">Prix Total (€)</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map((supply, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <Input
                      value={supply.supplier}
                      onChange={(e) => handleUpdateSupply(index, 'supplier', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      value={supply.material}
                      onChange={(e) => handleUpdateSupply(index, 'material', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      value={supply.unit}
                      onChange={(e) => handleUpdateSupply(index, 'unit', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={supply.quantity}
                      onChange={(e) => handleUpdateSupply(index, 'quantity', e.target.value)}
                      className="w-full text-right"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={supply.unitPrice}
                      onChange={(e) => handleUpdateSupply(index, 'unitPrice', e.target.value)}
                      className="w-full text-right"
                    />
                  </td>
                  <td className="border p-2 text-right font-medium">
                    {(supply.quantity * supply.unitPrice).toFixed(2)} €
                  </td>
                  <td className="border p-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSupply(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="border p-2 text-right font-medium">Total</td>
                <td className="border p-2 text-right font-medium">
                  {supplies.reduce((sum, supply) => sum + (supply.quantity * supply.unitPrice), 0).toFixed(2)} €
                </td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <Button type="button" variant="outline" onClick={handleAddSupply} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une fourniture
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuppliesSection;
