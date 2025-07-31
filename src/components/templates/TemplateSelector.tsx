import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { WorkLogTemplate, BlankWorksheetTemplate } from '@/types/templates';
import { FileText, Plus, Trash2 } from 'lucide-react';

interface TemplateSelectorProps {
  type: 'worklog' | 'worksheet';
  templates: WorkLogTemplate[] | BlankWorksheetTemplate[];
  onApplyTemplate: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  selectedTemplateId?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  type,
  templates,
  onApplyTemplate,
  onDeleteTemplate,
  selectedTemplateId
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      maintenance: 'bg-blue-100 text-blue-800',
      installation: 'bg-green-100 text-green-800',
      repair: 'bg-red-100 text-red-800',
      inspection: 'bg-yellow-100 text-yellow-800',
      client_visit: 'bg-purple-100 text-purple-800',
      quote: 'bg-orange-100 text-orange-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.custom;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      maintenance: 'Maintenance',
      installation: 'Installation',
      repair: 'Réparation',
      inspection: 'Inspection',
      client_visit: 'Visite client',
      quote: 'Devis',
      custom: 'Personnalisé'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select value={selectedTemplateId} onValueChange={onApplyTemplate}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Choisir un template..." />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{template.name}</span>
                  <Badge variant="outline" className={getCategoryColor(template.category)}>
                    {getCategoryLabel(template.category)}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Templates disponibles</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {templates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline" className={getCategoryColor(template.category)}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                      {template.isDefault && (
                        <Badge variant="secondary">Par défaut</Badge>
                      )}
                    </div>
                    {!template.isDefault && onDeleteTemplate && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {template.description && (
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => onApplyTemplate(template.id)}
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};