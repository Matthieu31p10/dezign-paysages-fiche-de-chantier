
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LockedDay {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'maintenance' | 'holiday' | 'formation' | 'autre';
}

interface LockedDaysManagerProps {
  month: number;
  year: number;
  lockedDays: LockedDay[];
  onLockedDaysChange: (lockedDays: LockedDay[]) => void;
}

const LockedDaysManager: React.FC<LockedDaysManagerProps> = ({
  month,
  year,
  lockedDays,
  onLockedDaysChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newLockedDay, setNewLockedDay] = useState<Partial<LockedDay>>({
    date: '',
    title: '',
    description: '',
    type: 'autre'
  });

  const handleAddLockedDay = () => {
    if (newLockedDay.date && newLockedDay.title) {
      const lockedDay: LockedDay = {
        id: crypto.randomUUID(),
        date: newLockedDay.date,
        title: newLockedDay.title,
        description: newLockedDay.description || '',
        type: newLockedDay.type as LockedDay['type']
      };
      
      onLockedDaysChange([...lockedDays, lockedDay]);
      setNewLockedDay({
        date: '',
        title: '',
        description: '',
        type: 'autre'
      });
    }
  };

  const handleRemoveLockedDay = (id: string) => {
    onLockedDaysChange(lockedDays.filter(day => day.id !== id));
  };

  const getTypeColor = (type: LockedDay['type']) => {
    switch (type) {
      case 'maintenance': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'holiday': return 'bg-green-100 text-green-700 border-green-300';
      case 'formation': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeLabel = (type: LockedDay['type']) => {
    switch (type) {
      case 'maintenance': return 'Maintenance';
      case 'holiday': return 'Congé';
      case 'formation': return 'Formation';
      default: return 'Autre';
    }
  };

  // Filter locked days for current month
  const currentMonthLockedDays = lockedDays.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate.getMonth() === month - 1 && dayDate.getFullYear() === year;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Jours verrouillés
          {currentMonthLockedDays.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {currentMonthLockedDays.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des jours verrouillés</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add new locked day */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ajouter un jour verrouillé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newLockedDay.date}
                    onChange={(e) => setNewLockedDay({ ...newLockedDay, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newLockedDay.type}
                    onChange={(e) => setNewLockedDay({ ...newLockedDay, type: e.target.value as LockedDay['type'] })}
                  >
                    <option value="autre">Autre</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="holiday">Congé</option>
                    <option value="formation">Formation</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Titre de la consigne</Label>
                <Input
                  id="title"
                  value={newLockedDay.title}
                  onChange={(e) => setNewLockedDay({ ...newLockedDay, title: e.target.value })}
                  placeholder="Ex: Maintenance préventive, Jour férié..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={newLockedDay.description}
                  onChange={(e) => setNewLockedDay({ ...newLockedDay, description: e.target.value })}
                  placeholder="Détails supplémentaires..."
                  rows={3}
                />
              </div>
              
              <Button onClick={handleAddLockedDay} className="w-full">
                Ajouter le jour verrouillé
              </Button>
            </CardContent>
          </Card>

          {/* List of locked days */}
          <Card>
            <CardHeader>
              <CardTitle>Jours verrouillés existants</CardTitle>
            </CardHeader>
            <CardContent>
              {lockedDays.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun jour verrouillé</p>
              ) : (
                <div className="space-y-3">
                  {lockedDays
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((day) => (
                      <div key={day.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {format(new Date(day.date), "EEEE d MMMM yyyy", { locale: fr })}
                            </span>
                            <Badge className={getTypeColor(day.type)}>
                              {getTypeLabel(day.type)}
                            </Badge>
                          </div>
                          <p className="font-semibold text-gray-900">{day.title}</p>
                          {day.description && (
                            <p className="text-sm text-gray-600 mt-1">{day.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLockedDay(day.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LockedDaysManager;
