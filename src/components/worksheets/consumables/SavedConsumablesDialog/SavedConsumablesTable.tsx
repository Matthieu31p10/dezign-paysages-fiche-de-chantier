
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, X } from 'lucide-react';
import { Consumable } from '@/types/models';

interface SavedConsumablesTableProps {
  savedConsumables: Consumable[];
  onLoad: (consumable: Consumable) => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

const SavedConsumablesTable: React.FC<SavedConsumablesTableProps> = ({
  savedConsumables,
  onLoad,
  onEdit,
  onRemove
}) => {
  if (savedConsumables.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucun consommable sauvegardé</p>
      </div>
    );
  }

  return (
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
                    onClick={() => onEdit(index)}
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
  );
};

export default SavedConsumablesTable;
