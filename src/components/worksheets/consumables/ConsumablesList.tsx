
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Consumable } from '@/types/models';

interface ConsumablesListProps {
  consumables: Consumable[];
  onRemove: (index: number) => void;
}

const ConsumablesList: React.FC<ConsumablesListProps> = ({ consumables, onRemove }) => {
  // Calculate total cost
  const totalConsumablesCost = consumables.reduce((total, item) => total + item.totalPrice, 0);
  
  if (consumables.length === 0) {
    return null;
  }

  return (
    <>
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
                    onClick={() => onRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <div className="bg-muted p-2 rounded-md text-right">
          <span className="font-semibold">Total des consommables: </span>
          <span>{totalConsumablesCost.toFixed(2)} €</span>
        </div>
      </div>
    </>
  );
};

export default ConsumablesList;
