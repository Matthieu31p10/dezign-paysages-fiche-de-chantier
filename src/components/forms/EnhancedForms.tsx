import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, Upload, X, Plus, Trash2, 
  Save, Eye, EyeOff, Info, AlertCircle,
  CheckCircle2, FileText, Image as ImageIcon,
  Star, Heart, ThumbsUp
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'switch' | 'date' | 'file' | 'number' | 'rating';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

interface EnhancedFormsProps {
  fields?: FormField[];
  onSubmit?: (data: any) => void;
  className?: string;
  showProgress?: boolean;
  multiStep?: boolean;
}

const defaultFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Nom complet', placeholder: 'Entrez votre nom', required: true },
  { id: 'email', type: 'email', label: 'Email', placeholder: 'votre@email.com', required: true },
  { id: 'phone', type: 'text', label: 'Téléphone', placeholder: '+33 1 23 45 67 89' },
  { id: 'company', type: 'text', label: 'Entreprise', placeholder: 'Nom de l\'entreprise' },
  { id: 'project_type', type: 'select', label: 'Type de projet', required: true, options: [
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'installation', label: 'Installation' },
    { value: 'repair', label: 'Réparation' },
    { value: 'consultation', label: 'Consultation' }
  ]},
  { id: 'priority', type: 'radio', label: 'Priorité', required: true, options: [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Élevée' },
    { value: 'urgent', label: 'Urgente' }
  ]},
  { id: 'start_date', type: 'date', label: 'Date de début', required: true },
  { id: 'notifications', type: 'switch', label: 'Recevoir des notifications' },
  { id: 'rating', type: 'rating', label: 'Évaluation du service' },
  { id: 'description', type: 'textarea', label: 'Description détaillée', placeholder: 'Décrivez votre projet...', required: true },
  { id: 'documents', type: 'file', label: 'Documents joints' },
  { id: 'terms', type: 'checkbox', label: 'J\'accepte les conditions d\'utilisation', required: true }
];

const RatingField: React.FC<{ value: number; onChange: (value: number) => void; }> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(star)}
          className="p-1 hover:bg-transparent"
        >
          <Star 
            className={cn(
              "h-5 w-5",
              star <= value 
                ? "fill-primary text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
          />
        </Button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `${value}/5` : 'Non évalué'}
      </span>
    </div>
  );
};

const FileUploadField: React.FC<{ 
  files: File[]; 
  onChange: (files: File[]) => void; 
  maxFiles?: number;
}> = ({ files, onChange, maxFiles = 5 }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
    onChange(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Choisir des fichiers
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
          </label>
        </Button>
        <span className="text-sm text-muted-foreground">
          {files.length}/{maxFiles} fichiers
        </span>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <FileText className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm truncate max-w-48">{file.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {(file.size / 1024).toFixed(1)}KB
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EnhancedForms: React.FC<EnhancedFormsProps> = ({
  fields = defaultFields,
  onSubmit,
  className = "",
  showProgress = true,
  multiStep = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = multiStep ? Math.ceil(fields.length / 4) : 1;
  const currentFields = multiStep 
    ? fields.slice(currentStep * 4, (currentStep + 1) * 4)
    : fields;

  const progress = multiStep 
    ? ((currentStep + 1) / totalSteps) * 100
    : (Object.keys(formData).length / fields.filter(f => f.required).length) * 100;

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateField = (field: FormField, value: any) => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} est requis`;
    }
    
    if (field.validation) {
      if (field.validation.min && value && value.length < field.validation.min) {
        return `${field.label} doit contenir au moins ${field.validation.min} caractères`;
      }
      if (field.validation.max && value && value.length > field.validation.max) {
        return `${field.label} ne peut pas dépasser ${field.validation.max} caractères`;
      }
      if (field.validation.pattern && value && !new RegExp(field.validation.pattern).test(value)) {
        return field.validation.message || `Format invalide pour ${field.label}`;
      }
    }
    
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(formData);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        );

      case 'password':
        return (
          <div className="relative">
            <Input
              type={showPassword[field.id] ? 'text' : 'password'}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={error ? 'border-destructive' : ''}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(prev => ({ 
                ...prev, 
                [field.id]: !prev[field.id] 
              }))}
            >
              {showPassword[field.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={cn("min-h-24", error ? 'border-destructive' : '')}
          />
        );

      case 'select':
        return (
          <Select 
            value={value || ''} 
            onValueChange={(val) => handleInputChange(field.id, val)}
          >
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={field.placeholder || `Sélectionner ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup 
            value={value || ''} 
            onValueChange={(val) => handleInputChange(field.id, val)}
            className="grid grid-cols-2 gap-4"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
            </Label>
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Switch
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked)}
            />
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "PPP") : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => handleInputChange(field.id, date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'rating':
        return (
          <RatingField
            value={value || 0}
            onChange={(rating) => handleInputChange(field.id, rating)}
          />
        );

      case 'file':
        return (
          <FileUploadField
            files={value || []}
            onChange={(files) => handleInputChange(field.id, files)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Formulaire Avancé</span>
          {showProgress && (
            <Badge variant="secondary">
              {Math.round(progress)}% complété
            </Badge>
          )}
        </CardTitle>
        {showProgress && (
          <Progress value={progress} className="w-full" />
        )}
        {multiStep && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-8 rounded-full",
                  index <= currentStep 
                    ? "bg-primary" 
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentFields.map((field) => (
            <div key={field.id} className="space-y-2">
              {field.type !== 'checkbox' && field.type !== 'switch' && (
                <Label htmlFor={field.id} className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
              )}
              
              {renderField(field)}
              
              {errors[field.id] && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors[field.id]}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-6">
            {multiStep ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Précédent
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Étape {currentStep + 1} sur {totalSteps}
                </div>
                
                {currentStep === totalSteps - 1 ? (
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Suivant
                  </Button>
                )}
              </>
            ) : (
              <Button type="submit" className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};