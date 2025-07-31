import { useState, useEffect } from 'react';
import { WorkLogTemplate, BlankWorksheetTemplate } from '@/types/templates';
import { toast } from 'sonner';

const WORKLOG_TEMPLATES_KEY = 'worklog_templates';
const WORKSHEET_TEMPLATES_KEY = 'worksheet_templates';

const defaultWorkLogTemplates: WorkLogTemplate[] = [
  {
    id: 'maintenance-basic',
    name: 'Maintenance de base',
    description: 'Template pour une maintenance standard',
    category: 'maintenance',
    isDefault: true,
    template: {
      tasks: 'Tonte, débroussaillage, nettoyage',
      wasteManagement: 'compost',
      estimatedDuration: 4,
      waterConsumption: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'installation-new',
    name: 'Nouvelle installation',
    description: 'Template pour les nouvelles installations',
    category: 'installation',
    isDefault: true,
    template: {
      tasks: 'Installation système d\'arrosage, plantation',
      wasteManagement: 'recyclage',
      estimatedDuration: 8,
      waterConsumption: 50
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultWorksheetTemplates: BlankWorksheetTemplate[] = [
  {
    id: 'client-visit',
    name: 'Visite client',
    description: 'Template pour les visites chez les clients',
    category: 'client_visit',
    isDefault: true,
    template: {
      tasks: 'Inspection, diagnostic, devis',
      wasteManagement: 'none',
      isQuoteSigned: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useTemplates = () => {
  const [workLogTemplates, setWorkLogTemplates] = useState<WorkLogTemplate[]>([]);
  const [worksheetTemplates, setWorksheetTemplates] = useState<BlankWorksheetTemplate[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    try {
      const savedWorkLogTemplates = localStorage.getItem(WORKLOG_TEMPLATES_KEY);
      const savedWorksheetTemplates = localStorage.getItem(WORKSHEET_TEMPLATES_KEY);

      setWorkLogTemplates(savedWorkLogTemplates ? 
        JSON.parse(savedWorkLogTemplates) : defaultWorkLogTemplates);
      setWorksheetTemplates(savedWorksheetTemplates ? 
        JSON.parse(savedWorksheetTemplates) : defaultWorksheetTemplates);
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
      setWorkLogTemplates(defaultWorkLogTemplates);
      setWorksheetTemplates(defaultWorksheetTemplates);
    }
  };

  const saveWorkLogTemplate = (template: Omit<WorkLogTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: WorkLogTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...workLogTemplates, newTemplate];
    setWorkLogTemplates(updated);
    localStorage.setItem(WORKLOG_TEMPLATES_KEY, JSON.stringify(updated));
    toast.success('Template sauvegardé');
    return newTemplate;
  };

  const saveWorksheetTemplate = (template: Omit<BlankWorksheetTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: BlankWorksheetTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...worksheetTemplates, newTemplate];
    setWorksheetTemplates(updated);
    localStorage.setItem(WORKSHEET_TEMPLATES_KEY, JSON.stringify(updated));
    toast.success('Template sauvegardé');
    return newTemplate;
  };

  const deleteTemplate = (id: string, type: 'worklog' | 'worksheet') => {
    if (type === 'worklog') {
      const updated = workLogTemplates.filter(t => t.id !== id);
      setWorkLogTemplates(updated);
      localStorage.setItem(WORKLOG_TEMPLATES_KEY, JSON.stringify(updated));
    } else {
      const updated = worksheetTemplates.filter(t => t.id !== id);
      setWorksheetTemplates(updated);
      localStorage.setItem(WORKSHEET_TEMPLATES_KEY, JSON.stringify(updated));
    }
    toast.success('Template supprimé');
  };

  const applyTemplate = (templateId: string, type: 'worklog' | 'worksheet') => {
    const template = type === 'worklog' 
      ? workLogTemplates.find(t => t.id === templateId)
      : worksheetTemplates.find(t => t.id === templateId);
    
    return template?.template || {};
  };

  return {
    workLogTemplates,
    worksheetTemplates,
    saveWorkLogTemplate,
    saveWorksheetTemplate,
    deleteTemplate,
    applyTemplate,
    loadTemplates
  };
};