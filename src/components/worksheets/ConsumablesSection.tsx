
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Database, Save } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { toast } from 'sonner';
import { Consumable } from '@/types/models';
import { ConsumableFormState, EmptyConsumable, SAVED_CONSUMABLES_KEY } from './consumables/types';
import ConsumableForm from './consumables/ConsumableForm';
import ConsumablesList from './consumables/ConsumablesList';
import SavedConsumablesDialog from './consumables/SavedConsumablesDialog';

const ConsumablesSection: React.FC = () => {
  const { watch, setValue } = useFormContext<BlankWorkSheetValues>();
  const [newConsumable, setNewConsumable] = useState<ConsumableFormState>({...EmptyConsumable});
  const [savedConsumablesDialogOpen, setSavedConsumablesDialogOpen] = useState(false);
  const [savedConsumables, setSavedConsumables] = useState<Consumable[]>([]);
  
  const consumables = watch('consumables') || [];
  
  // Load saved consumables from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem(SAVED_CONSUMABLES_KEY);
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Ensure all items conform to Consumable type
        const typedItems: Consumable[] = parsedItems.map((item: any): Consumable => ({
          supplier: item.supplier || '',
          product: item.product || '',
          unit: item.unit || '',
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.unitPrice) || 0,
          totalPrice: Number(item.totalPrice) || 0
        }));
        setSavedConsumables(typedItems);
      } catch (e) {
        console.error('Error loading saved consumables', e);
        // Reset saved consumables if there's an error
        localStorage.removeItem(SAVED_CONSUMABLES_KEY);
      }
    }
  }, []);
  
  const updateNewConsumable = (field: keyof ConsumableFormState, value: string | number) => {
    setNewConsumable(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculer le prix total lors de la mise à jour de la quantité ou du prix unitaire
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }
      
      return updated;
    });
  };

  const handleAddConsumable = () => {
    // Only add if quantity and price are valid
    if (newConsumable.quantity <= 0) {
      toast.error("La quantité doit être supérieure à 0");
      return;
    }

    // Calculate total price
    const totalPrice = newConsumable.quantity * newConsumable.unitPrice;
    
    // Ensure all properties are defined to match Consumable type
    const consumableToAdd: Consumable = {
      supplier: newConsumable.supplier || '',
      product: newConsumable.product || '',
      unit: newConsumable.unit || '',
      quantity: Number(newConsumable.quantity) || 0,
      unitPrice: Number(newConsumable.unitPrice) || 0,
      totalPrice: Number(totalPrice) || 0
    };
    
    // Cast consumables to be compatible with Consumable type
    const typedConsumables: Consumable[] = Array.isArray(consumables) ? 
      consumables.map(item => ({
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      })) : [];
    
    const updatedConsumables: Consumable[] = [...typedConsumables, consumableToAdd];
    setValue('consumables', updatedConsumables);
    
    // Reset the form
    setNewConsumable({...EmptyConsumable});
  };
  
  const handleRemoveConsumable = (index: number) => {
    // Cast consumables to be compatible with Consumable type
    const typedConsumables: Consumable[] = Array.isArray(consumables) ? 
      consumables.map(item => ({
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      })) : [];
      
    const updatedConsumables = [...typedConsumables];
    updatedConsumables.splice(index, 1);
    setValue('consumables', updatedConsumables);
  };
  
  // Save consumables
  const handleSaveConsumables = () => {
    // Check if there are consumables to save
    if (consumables.length === 0) {
      toast.error("Aucun consommable à sauvegarder");
      return;
    }
    
    // Cast consumables to be compatible with Consumable type
    const typedConsumables: Consumable[] = Array.isArray(consumables) ? 
      consumables.map(item => ({
        supplier: item.supplier || '',
        product: item.product || '',
        unit: item.unit || '',
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        totalPrice: Number(item.totalPrice) || 0
      })) : [];
    
    // Only save consumables that have valid quantities
    const validConsumables = typedConsumables.filter(c => c.quantity > 0);
    
    if (validConsumables.length === 0) {
      toast.error("Aucun consommable valide à sauvegarder");
      return;
    }
    
    // Add current consumables to saved consumables
    const updatedSavedConsumables: Consumable[] = [
      ...savedConsumables, 
      ...validConsumables
    ];
    
    setSavedConsumables(updatedSavedConsumables);
    
    // Save to localStorage
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    
    toast.success("Consommables sauvegardés avec succès");
  };
  
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
    
    // Update localStorage
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    
    toast.success("Consommable supprimé");
  };
  
  // Update a saved consumable
  const handleUpdateSavedConsumable = (index: number, updatedConsumable: Consumable) => {
    const updatedSavedConsumables = [...savedConsumables];
    updatedSavedConsumables[index] = updatedConsumable;
    
    setSavedConsumables(updatedSavedConsumables);
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    
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
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Ajouter un consommable</h3>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSavedConsumablesDialogOpen(true)}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Consommables sauvegardés
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveConsumables}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
            
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
      
      {/* Saved consumables dialog */}
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
