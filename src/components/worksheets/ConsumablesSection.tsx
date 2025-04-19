
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { Consumable } from '@/types/models';
import { EmptyConsumable } from './consumables/types';
import ConsumableForm from './consumables/ConsumableForm';
import ConsumablesList from './consumables/ConsumablesList';
import SavedConsumablesDialog from './consumables/SavedConsumablesDialog';
import ConsumablesHeader from './consumables/components/ConsumablesHeader';
import { useConsumablesState } from './consumables/hooks/useConsumablesState';
import { useConsumableActions } from './consumables/hooks/useConsumableActions';
import { toast } from 'sonner';

const ConsumablesSection: React.FC = () => {
  const {
    newConsumable,
    setNewConsumable,
    savedConsumablesDialogOpen,
    setSavedConsumablesDialogOpen,
    savedConsumables,
    setSavedConsumables,
    consumables,
    setValue
  } = useConsumablesState();

  const {
    updateNewConsumable,
    handleAddConsumable,
    handleRemoveConsumable,
    handleSaveConsumables
  } = useConsumableActions(
    newConsumable,
    setNewConsumable,
    consumables,
    setValue,
    savedConsumables,
    setSavedConsumables
  );

  // Load a saved consumable into the form
  const handleLoadSavedConsumable = (consumable: Consumable) => {
    setNewConsumable({ 
      supplier: consumable.supplier || '',
      product: consumable.product || '',
      unit: consumable.unit || '',
      quantity: consumable.quantity,
      unitPrice: consumable.unitPrice,
      totalPrice: consumable.totalPrice
    });
    setSavedConsumablesDialogOpen(false);
  };
  
  // Remove a saved consumable
  const handleRemoveSavedConsumable = (index: number) => {
    const updatedSavedConsumables = [...savedConsumables];
    updatedSavedConsumables.splice(index, 1);
    setSavedConsumables(updatedSavedConsumables);
    localStorage.setItem('saved_consumables', JSON.stringify(updatedSavedConsumables));
    toast.success("Consommable supprimé");
  };
  
  // Update a saved consumable
  const handleUpdateSavedConsumable = (index: number, updatedConsumable: Consumable) => {
    const updatedSavedConsumables = [...savedConsumables];
    updatedSavedConsumables[index] = updatedConsumable;
    setSavedConsumables(updatedSavedConsumables);
    localStorage.setItem('saved_consumables', JSON.stringify(updatedSavedConsumables));
    toast.success("Consommable mis à jour");
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center">
        <Package className="w-5 h-5 mr-2 text-muted-foreground" />
        Consommables
      </h2>
      
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <ConsumablesHeader 
              onOpenSaved={() => setSavedConsumablesDialogOpen(true)}
              onSave={handleSaveConsumables}
            />
            
            <ConsumableForm 
              consumable={newConsumable} 
              updateConsumable={updateNewConsumable}
              onAdd={handleAddConsumable}
            />
            
            {consumables.length > 0 && (
              <ConsumablesList 
                consumables={consumables as Consumable[]}
                onRemove={handleRemoveConsumable}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <SavedConsumablesDialog
        open={savedConsumablesDialogOpen}
        onOpenChange={setSavedConsumablesDialogOpen}
        savedConsumables={savedConsumables}
        onLoad={handleLoadSavedConsumable}
        onRemove={handleRemoveSavedConsumable}
        onUpdate={handleUpdateSavedConsumable}
      />
    </div>
  );
};

export default ConsumablesSection;
