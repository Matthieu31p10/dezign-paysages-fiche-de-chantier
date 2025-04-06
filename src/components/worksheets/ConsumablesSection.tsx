
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Tag, Package, Store, X, Save, Database, Edit, Check } from 'lucide-react';
import { BlankWorkSheetValues } from './schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

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

// Key for storing saved consumables in localStorage
const SAVED_CONSUMABLES_KEY = 'saved_consumables';

const ConsumablesSection: React.FC = () => {
  const { control, watch, setValue, getValues } = useFormContext<BlankWorkSheetValues>();
  const [newConsumable, setNewConsumable] = useState<Consumable>({...EmptyConsumable});
  const [savedConsumablesDialogOpen, setSavedConsumablesDialogOpen] = useState(false);
  const [savedConsumables, setSavedConsumables] = useState<Consumable[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedConsumableIndex, setSelectedConsumableIndex] = useState<number | null>(null);
  
  const consumables = watch('consumables') || [];
  
  // Load saved consumables from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem(SAVED_CONSUMABLES_KEY);
    if (savedItems) {
      try {
        setSavedConsumables(JSON.parse(savedItems));
      } catch (e) {
        console.error('Error loading saved consumables', e);
        // Reset saved consumables if there's an error
        localStorage.removeItem(SAVED_CONSUMABLES_KEY);
      }
    }
  }, []);
  
  const handleAddConsumable = () => {
    // Skip validation if all fields are empty - allows adding empty consumables
    if (!newConsumable.supplier && !newConsumable.product && !newConsumable.unit && 
        newConsumable.quantity <= 0 && newConsumable.unitPrice <= 0) {
      return;
    }
    
    // If at least one field is filled, require product and unit at minimum
    if (!newConsumable.product || !newConsumable.unit) {
      toast.error("Le produit et l'unité sont requis");
      return;
    }
    
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
  
  // Sauvegarder les consommables
  const handleSaveConsumables = () => {
    // Vérifier si des consommables sont disponibles
    if (consumables.length === 0) {
      toast.error("Aucun consommable à sauvegarder");
      return;
    }
    
    // Ajouter les consommables actuels aux consommables sauvegardés
    const updatedSavedConsumables = [...savedConsumables, ...consumables];
    setSavedConsumables(updatedSavedConsumables);
    
    // Sauvegarder dans localStorage
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    
    toast.success("Consommables sauvegardés avec succès");
  };
  
  // Charger les consommables sauvegardés
  const handleLoadSavedConsumable = (consumable: Consumable) => {
    setNewConsumable({ ...consumable });
    setSavedConsumablesDialogOpen(false);
  };
  
  // Supprimer un consommable sauvegardé
  const handleRemoveSavedConsumable = (index: number) => {
    const updatedSavedConsumables = [...savedConsumables];
    updatedSavedConsumables.splice(index, 1);
    setSavedConsumables(updatedSavedConsumables);
    
    // Mettre à jour localStorage
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    
    toast.success("Consommable supprimé");
  };
  
  // Modifier un consommable sauvegardé
  const handleStartEditSavedConsumable = (index: number) => {
    setSelectedConsumableIndex(index);
    setEditMode(true);
  };
  
  const handleSaveEditedConsumable = () => {
    if (selectedConsumableIndex === null) return;
    
    const updatedSavedConsumables = [...savedConsumables];
    updatedSavedConsumables[selectedConsumableIndex] = { 
      ...savedConsumables[selectedConsumableIndex],
      ...newConsumable,
      totalPrice: newConsumable.quantity * newConsumable.unitPrice 
    };
    
    setSavedConsumables(updatedSavedConsumables);
    localStorage.setItem(SAVED_CONSUMABLES_KEY, JSON.stringify(updatedSavedConsumables));
    
    setEditMode(false);
    setSelectedConsumableIndex(null);
    setNewConsumable({...EmptyConsumable});
    
    toast.success("Consommable mis à jour");
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
      
      {/* Dialog pour les consommables sauvegardés */}
      <Dialog open={savedConsumablesDialogOpen} onOpenChange={setSavedConsumablesDialogOpen}>
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
                            onClick={() => handleLoadSavedConsumable(item)}
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
                            onClick={() => handleRemoveSavedConsumable(index)}
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
                    value={newConsumable.supplier}
                    onChange={(e) => updateNewConsumable('supplier', e.target.value)}
                    placeholder="Fournisseur"
                  />
                </div>
                <div>
                  <FormLabel>Produit</FormLabel>
                  <Input
                    value={newConsumable.product}
                    onChange={(e) => updateNewConsumable('product', e.target.value)}
                    placeholder="Produit"
                  />
                </div>
                <div>
                  <FormLabel>Unité</FormLabel>
                  <Input
                    value={newConsumable.unit}
                    onChange={(e) => updateNewConsumable('unit', e.target.value)}
                    placeholder="Unité"
                  />
                </div>
                <div>
                  <FormLabel>Quantité</FormLabel>
                  <Input
                    type="number"
                    value={newConsumable.quantity}
                    onChange={(e) => updateNewConsumable('quantity', parseFloat(e.target.value) || 0)}
                    min="0.01"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
                <div>
                  <FormLabel>Prix unitaire (€)</FormLabel>
                  <Input
                    type="number"
                    value={newConsumable.unitPrice}
                    onChange={(e) => updateNewConsumable('unitPrice', parseFloat(e.target.value) || 0)}
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
            <Button onClick={() => setSavedConsumablesDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsumablesSection;
